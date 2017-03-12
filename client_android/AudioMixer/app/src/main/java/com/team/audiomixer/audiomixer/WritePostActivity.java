package com.team.audiomixer.audiomixer;

import android.app.Activity;
import android.app.ProgressDialog;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.content.Intent;
import android.database.Cursor;
import android.provider.MediaStore;
import android.widget.ImageButton;
import android.widget.RadioButton;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;

public class WritePostActivity extends AppCompatActivity
{
    private EditText mEditTextTitle;
    private EditText mEditTextLeft;
    private EditText mEditTextRight;
    private Button mButtonWrite;
    private RadioButton mOptionOne;
    private RadioButton mOptionTwo;
    private RadioButton mOptionThree;
    private ImageButton mButtonAddLeftImage;
    private ImageButton mButtonAddRightImage;
    private ArrayList<String> mListStringKey;
    private ArrayList<String> mListStringVal;
    private ArrayList<String> mListFileKey;
    private ArrayList<String> mListFileVal;
    private ProgressDialog mProgressDialog;

    final int REQ_CODE_LEFT_IMAGE = 100;
    final int REQ_CODE_RIGHT_IMAGE = 200;

    final int POST_FAIL = 1;
    final int POST_SUCCESS = 2;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_write_post);

        mEditTextTitle = (EditText) findViewById(R.id.editTextTitle);
        mEditTextLeft = (EditText) findViewById(R.id.editTextLeft);
        mEditTextRight = (EditText) findViewById(R.id.editTextRight);

        mButtonWrite = (Button) findViewById(R.id.buttonWrite);
        mButtonAddLeftImage = (ImageButton) findViewById(R.id.buttonAddLeftImage);
        mButtonAddRightImage = (ImageButton) findViewById(R.id.buttonAddRightImage);

        mOptionOne = (RadioButton) findViewById(R.id.optionOne);
        mOptionTwo = (RadioButton) findViewById(R.id.optionTwo);
        mOptionThree = (RadioButton) findViewById(R.id.optionThree);
        mOptionOne.setChecked(true);

        mListFileKey = new ArrayList<String>();
        mListFileVal = new ArrayList<String>();
        mListStringKey = new ArrayList<String>();
        mListStringVal = new ArrayList<String>();
        mProgressDialog = new ProgressDialog(this);


        mButtonWrite.setOnClickListener(mBtnWriteOnClickListener);
        mButtonAddLeftImage.setOnClickListener(mBtnAddLeftImageOnClickListener);
        mButtonAddRightImage.setOnClickListener(mBtnAddRightImageOnClickListener);

        mProgressDialog.setMessage("Loading...");
        mProgressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        mProgressDialog.setCanceledOnTouchOutside(false);
        mProgressDialog.setCancelable(false);

        String [] permissionStr = {android.Manifest.permission.READ_EXTERNAL_STORAGE, android.Manifest.permission.WRITE_EXTERNAL_STORAGE};
        ActivityCompat.requestPermissions(this, permissionStr, 1);
    }

    /**
     * EXIF정보를 회전각도로 변환하는 메서드
     *
     * @param exifOrientation EXIF 회전각
     * @return 실제 각도
     */
    public int exifOrientationToDegrees(int exifOrientation)
    {
        if(exifOrientation == ExifInterface.ORIENTATION_ROTATE_90)
        {
            return 90;
        }
        else if(exifOrientation == ExifInterface.ORIENTATION_ROTATE_180)
        {
            return 180;
        }
        else if(exifOrientation == ExifInterface.ORIENTATION_ROTATE_270)
        {
            return 270;
        }
        return 0;
    }

    /**
     * 이미지를 회전시킵니다.
     *
     * @param bitmap 비트맵 이미지
     * @param degrees 회전 각도
     * @return 회전된 이미지
     */
    public Bitmap rotate(Bitmap bitmap, int degrees)
    {
        if(degrees != 0 && bitmap != null)
        {
            Matrix m = new Matrix();
            m.setRotate(degrees, (float) bitmap.getWidth() / 2,
                    (float) bitmap.getHeight() / 2);

            try
            {
                Bitmap converted = Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), m, true);
                if(bitmap != converted)
                {
                    bitmap.recycle();
                    bitmap = converted;
                }
            }
            catch(OutOfMemoryError ex)
            {
                // 메모리가 부족하여 회전을 시키지 못할 경우 그냥 원본을 반환합니다.
            }
        }
        return bitmap;
    }

    Bitmap makeBitmap(String path) {
        int dstWidth = mButtonAddLeftImage.getWidth() - 10;
        int dstHeight = mButtonAddLeftImage.getHeight() - 10;

        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize = 4;
        Bitmap src = BitmapFactory.decodeFile(path, options);

        // 이미지를 상황에 맞게 회전시킨다
        try {
            ExifInterface exif = new ExifInterface(path);
            int exifOrientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
            int exifDegree = exifOrientationToDegrees(exifOrientation);
            src = rotate(src, exifDegree);
        }
        catch(Exception e) {
            Log.d("WritePost", "makeImage " + e.getMessage());
        }

        Bitmap resizeImage = Bitmap.createScaledBitmap( src, dstWidth, dstHeight, true );

        return resizeImage;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        //super.onActivityResult(requestCode, resultCode, data);
        if(resultCode == Activity.RESULT_OK)
        {
            String path = null;
            String key = null;
            int dstWidth = mButtonAddLeftImage.getWidth();
            int dstHeight = mButtonAddLeftImage.getHeight();

            switch (requestCode)
            {
                case REQ_CODE_LEFT_IMAGE:
                    path = getMediaFileInfo(data, MediaStore.Images.Media.DATA);
                    key = "LeftImage.jpg";
                    mButtonAddLeftImage.setImageBitmap(makeBitmap(path));
                    break;

                case REQ_CODE_RIGHT_IMAGE:
                    path = getMediaFileInfo(data, MediaStore.Images.Media.DATA);
                    key = "RightImage.jpg";
                    mButtonAddRightImage.setImageBitmap(makeBitmap(path));
                    break;

                default:
                    break;
            }

            if(path != null && key != null)
            {
                //mListFileKey.add(path.substring(path.lastIndexOf('/') + 1));
                mListFileKey.add(key);
                mListFileVal.add(path);
            }

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

    Button.OnClickListener mBtnAddRightImageOnClickListener = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            Log.d("WritePost", "Add mBtnAddRightImageOnClickListener clicked");

            Intent intent = new Intent(Intent.ACTION_PICK);
            intent.setType(android.provider.MediaStore.Images.Media.CONTENT_TYPE);
            intent.setData(android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, REQ_CODE_RIGHT_IMAGE);
        }
    };

    Button.OnClickListener mBtnAddLeftImageOnClickListener = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            Log.d("WritePost", "Add mBtnAddLeftImageOnClickListener clicked");

            Intent intent = new Intent(Intent.ACTION_PICK);
            intent.setType(android.provider.MediaStore.Images.Media.CONTENT_TYPE);
            intent.setData(android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, REQ_CODE_LEFT_IMAGE);
        }
    };

    Button.OnClickListener mBtnWriteOnClickListener = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            Log.d("WritePost", mEditTextTitle.getText().toString());
            Log.d("WritePost", mEditTextLeft.getText().toString());

            if(mEditTextTitle.getText().toString().isEmpty() || mEditTextLeft.getText().toString().isEmpty() || mEditTextRight.getText().toString().isEmpty()) {
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
                    mListStringKey.add("LeftText");
                    mListStringVal.add(mEditTextLeft.getText().toString());
                    mListStringKey.add("RightText");
                    mListStringVal.add(mEditTextRight.getText().toString());
                    mListStringKey.add("Email");
                    mListStringVal.add("TestEmail@gmail.com");

                    mListStringKey.add("PickCount");
                    if(mOptionOne.isChecked() == true)
                        mListStringVal.add("3");
                    else if(mOptionTwo.isChecked() == true)
                        mListStringVal.add("5");
                    else if(mOptionThree.isChecked() == true)
                        mListStringVal.add("7");

                    excuteFilePost("http://192.168.11.108:5000/");
                }
            }.start();
        }
    };

    final Handler mHandler = new Handler(){
        public void handleMessage(Message msg){
            int contentNo = 0;

            mProgressDialog.dismiss();

            switch (msg.what)
            {
                case POST_FAIL:
                    Toast.makeText(getApplicationContext(), "등록 실패 다시 시도하세요.", Toast.LENGTH_SHORT).show();
                    break;

                case POST_SUCCESS:
                    contentNo = msg.arg1;
                    Intent intent = new Intent(WritePostActivity.this, MixingActivity.class);
                    intent.putExtra("BOARD_NO", contentNo);
                    startActivity(intent);
                    finish();
                    Toast.makeText(getApplicationContext(), "등록 성공", Toast.LENGTH_SHORT).show();
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
            String line = "";
            String strJson = "";

            while ((line = rd.readLine()) != null)
            {
                Log.d("WritePost", "server response: " + line);
                strJson += line;
            }

            try
            {
                JSONObject jsonObject = new JSONObject(strJson);
                int contentNo = jsonObject.getInt("ContentNo");
                handlerMsg.arg1 = contentNo;
            }
            catch (JSONException e)
            {
                Log.d("WritePost", "server response json parsing fail " + strJson);
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
