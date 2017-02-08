package com.team.audiomixer.audiomixer;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.RequiresPermission;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.content.Intent;
import android.database.Cursor;
import android.provider.MediaStore;
import android.widget.ListView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;

public class WritePostActivity extends AppCompatActivity
implements MediaListViewAdapter.MediaListViewDeleteBtnClickListener
         , MediaListViewAdapter.MediaListViewSelectBtnClickListener
{
    private EditText mEditTextTitle;
    private EditText mEditTextContent;
    private Button mButtonWrite;
    private Button mButtonAddImage;
    private Button mButtonAddMedia;
    private String mFilePath;
    private ArrayList<String> mListStringKey;
    private ArrayList<String> mListStringVal;
    private ArrayList<String> mListFileKey;
    private ArrayList<String> mListFileVal;
    private ArrayList<Integer> mListInstrumentKey;
    private ListView mMediaListView;
    private MediaListViewAdapter mMediaListVeiwAdapter;
    private ProgressDialog mProgressDialog;

    final int REQ_CODE_IMAGE = 100;
    final int REQ_CODE_AUDIO = 200;
    final int REQ_CODE_VIDEO = 300;
    final int POST_FAIL = 1;
    final int POST_SUCCESS = 2;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_write_post);

        mEditTextTitle = (EditText) findViewById(R.id.editTextTitle);
        mEditTextContent = (EditText) findViewById(R.id.editTextContent);
        mButtonWrite = (Button) findViewById(R.id.buttonWrite);
        mButtonAddImage = (Button) findViewById(R.id.buttonAddImage);
        mButtonAddMedia = (Button) findViewById(R.id.buttonAddMedia);
        mListFileKey = new ArrayList<String>();
        mListFileVal = new ArrayList<String>();
        mListStringKey = new ArrayList<String>();
        mListStringVal = new ArrayList<String>();
        mListInstrumentKey = new ArrayList<Integer>();
        mFilePath = "";
        mMediaListView = (ListView) findViewById(R.id.MediaListView);
        mMediaListVeiwAdapter = new MediaListViewAdapter();
        mProgressDialog = new ProgressDialog(this);


        mButtonWrite.setOnClickListener(mBtnWriteOnClickListener);
        mButtonAddImage.setOnClickListener(mBtnAddImageOnClickListener);
        mButtonAddMedia.setOnClickListener(mBtnAddMediaOnClickListener);

        mMediaListVeiwAdapter.setDeleteBtnListener(this);
        mMediaListVeiwAdapter.setSelectBtnListener(this);
        mMediaListView.setAdapter(mMediaListVeiwAdapter);

        mProgressDialog.setMessage("Loading...");
        mProgressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        mProgressDialog.setCanceledOnTouchOutside(false);
        mProgressDialog.setCancelable(false);

        String [] permissionStr = {android.Manifest.permission.READ_EXTERNAL_STORAGE, android.Manifest.permission.WRITE_EXTERNAL_STORAGE};
        ActivityCompat.requestPermissions(this, permissionStr, 1);
    }

    public void addMediaItem()
    {
        if(mFilePath.length() > 0)
        {
            mListFileKey.add(mFilePath.substring(mFilePath.lastIndexOf('/') + 1));
            mListFileVal.add(mFilePath);
            mMediaListVeiwAdapter.addItem(mFilePath.substring(mFilePath.lastIndexOf('/') + 1));
            mMediaListVeiwAdapter.notifyDataSetChanged();
            mListInstrumentKey.add(-1);
        }
    }

    @Override
    public void onClickListenerMediaListViewDeleteBtn(int position) {
        Log.d("WritePost", "delete Button listener in activity");
        mListFileKey.remove(position);
        mListFileVal.remove(position);
    }

    @Override
    public void onClickListenerMediaListViewSelectBtn(int position) {
        final String[] items = {"기타", "드럼", "피아노", "보컬", "MIX", "사진/비디오"};
        final int pos = position;
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);

        // 제목셋팅
        alertDialogBuilder.setTitle("악기 선택");
        alertDialogBuilder.setSingleChoiceItems(items, -1,
            new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog,int id) {
                    Log.d("WritePost", items[id] + " 선택");
                    mListInstrumentKey.set(pos, id);
                    mMediaListVeiwAdapter.setSelectBtnText(pos, items[id]);
                    dialog.dismiss();
                }
            }
        );

        // 다이얼로그 생성, 보여주기
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        //super.onActivityResult(requestCode, resultCode, data);
        if(resultCode == Activity.RESULT_OK)
        {
            String path = null;

            switch (requestCode)
            {
                case REQ_CODE_IMAGE:
                    path = getMediaFileInfo(data, MediaStore.Images.Media.DATA);
                    break;

                case REQ_CODE_AUDIO:
                    path = getMediaFileInfo(data, MediaStore.Audio.Media.DATA);
                    break;

                case REQ_CODE_VIDEO:
                    path = getMediaFileInfo(data, MediaStore.Video.Media.DATA);
                    break;

                default:
                    break;
            }

            mFilePath = path;
            addMediaItem();
            Log.d("WritePost", "Path : " + path);
        }
    }

    public String getMediaFileInfo(Intent data, String mediaStore)
    {
        Cursor cursor = null;
        String[] proj = {mediaStore};
        String path = null;
        int column_index = 0;

        cursor = managedQuery(data.getData(), proj, null, null, null);
        column_index = cursor.getColumnIndexOrThrow(proj[0]);
        cursor.moveToFirst();
        path = cursor.getString(column_index);

        return path;
    }

    Button.OnClickListener mBtnAddMediaOnClickListener = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            Log.d("WritePost", "Add media clicked");

            Intent intent = new Intent(Intent.ACTION_PICK);
            intent.setType(android.provider.MediaStore.Audio.Media.CONTENT_TYPE);
            intent.setData(android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, REQ_CODE_AUDIO);
        }
    };

    Button.OnClickListener mBtnAddImageOnClickListener = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            Log.d("WritePost", "Add image clicked");

            Intent intent = new Intent(Intent.ACTION_PICK);
            intent.setType(android.provider.MediaStore.Images.Media.CONTENT_TYPE);
            intent.setData(android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, REQ_CODE_IMAGE);
        }
    };

    Button.OnClickListener mBtnWriteOnClickListener = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            Log.d("WritePost", mEditTextTitle.getText().toString());
            Log.d("WritePost", mEditTextContent.getText().toString());

            for(int i = 0; i < mListInstrumentKey.size(); i++)
            {
                if(mListInstrumentKey.get(i) == -1)
                {
                    Toast.makeText(getApplicationContext(), "악기를 선택하세요.", Toast.LENGTH_SHORT).show();
                    return;
                }
            }

            if(mEditTextTitle.getText().toString().isEmpty() || mEditTextContent.getText().toString().isEmpty()) {
                Toast.makeText(getApplicationContext(), "제목 및 내용 입력하세요.", Toast.LENGTH_SHORT).show();
                return;
            }

            mProgressDialog.show();

            new Thread()
            {
                public void run()
                {
                    mListStringKey.clear();
                    mListStringVal.clear();

                    mListStringKey.add("Title");
                    mListStringVal.add(mEditTextTitle.getText().toString());
                    mListStringKey.add("Content");
                    mListStringVal.add(mEditTextContent.getText().toString());
                    mListStringKey.add("Email");
                    mListStringVal.add("TestEmail@gmail.com");

                    excuteFilePost("http://localhost:5000/posting");
                }
            }.start();
        }
    };

    final Handler mHandler = new Handler(){
        public void handleMessage(Message msg){
            int boardNo = 0;

            mProgressDialog.dismiss();

            switch (msg.what)
            {
                case POST_FAIL:
                    Toast.makeText(getApplicationContext(), "등록 실패 다시 시도하세요.", Toast.LENGTH_SHORT).show();
                    break;

                case POST_SUCCESS:
                    boardNo = msg.arg1;
                    Intent intent = new Intent(WritePostActivity.this, MixingActivity.class);
                    intent.putExtra("BOARD_NO", boardNo);
                    startActivity(intent);
                    finish();
                    break;

                default:
                    break;
            }


        }
    };


    public void excuteFilePost(String serverURL)
    {
        Message handlerMsg = mHandler.obtainMessage();

        try {
            URL url = new URL(serverURL);
            String boundary = "s00h00i00n";
            URLConnection con = url.openConnection();
            con.setConnectTimeout(5000);
            con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
            con.setDoOutput(true);

            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            Log.d("WritePost", "excuteFilePost");

            // Post Sting
            // name: 서버 변수명
            for(int i = 0; i < mListStringKey.size(); i++)
            {
                wr.writeBytes("\r\n--" + boundary + "\r\n");
                wr.writeBytes("Content-Disposition: form-data; name=\"" + mListStringKey.get(i) + "\"\r\n\r\n"/* + listStringVal.get(i)*/);
                wr.writeUTF(mListStringVal.get(i));
            }

            // Post File
            // filename: 서버에 저장할 파일명
            for(int i = 0; i < mListFileKey.size(); i++)
            {
                wr.writeBytes("\r\n--" + boundary + "\r\n");
                wr.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"" /*+ listFileKey.get(i) + "\"\r\n"*/);
                wr.writeUTF(mListFileKey.get(i));
                wr.writeBytes("\"\r\n");
                wr.writeBytes("Content-Type: application/octet-stream\r\n\r\n");

                FileInputStream fileInputStream = new FileInputStream(mListFileVal.get(i));
                int bytesAvailable = fileInputStream.available();
                int maxBufferSize = 1024;
                int bufferSize = Math.min(bytesAvailable, maxBufferSize);
                byte[] buffer = new byte[bufferSize];
                int bytesRead = fileInputStream.read(buffer, 0, bufferSize);

                while (bytesRead > 0)
                {
                    // Upload file part(s)
                    DataOutputStream dataWrite = new DataOutputStream(con.getOutputStream());
                    dataWrite.write(buffer, 0, bufferSize);
                    bytesAvailable = fileInputStream.available();
                    bufferSize = Math.min(bytesAvailable, maxBufferSize);
                    bytesRead = fileInputStream.read(buffer, 0, bufferSize);
                }

                fileInputStream.close();
            }

            // Server로 전송
            // 마지막 boundary는 '--' 앞, 뒤로 추가
            wr.writeBytes("\r\n--" + boundary + "--\r\n");
            wr.flush();
            wr.close();

            // server return
            BufferedReader rd = null;
            rd = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
            String line = null;

            while ((line = rd.readLine()) != null)
            {
                Log.d("WritePost", "server response: " + line);
                handlerMsg.arg1 = Integer.parseInt(line);
            }

            rd.close();

            handlerMsg.what = POST_SUCCESS;
            mHandler.sendMessage(handlerMsg);

            Log.d("WritePost", "end post");
        }
        catch (IOException e)
        {
            handlerMsg.what = POST_FAIL;
            mHandler.sendMessage(handlerMsg);

            Log.d("WritePost", "Err msg: " + e.getMessage());
        }
    }
}
