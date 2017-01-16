package com.team.audiomixer.audiomixer;

import android.app.Activity;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.content.Intent;
import android.database.Cursor;
import android.provider.MediaStore;

import org.json.JSONException;
import org.json.JSONObject;

public class WritePostActivity extends AppCompatActivity
{
    private EditText mEditTextTitle;
    private EditText mEditTextContent;
    private Button mButtonWrite;
    private Button mButtonAddImage;
    private Button mButtonAddMedia;

    final int REQ_CODE_IMAGE = 100;
    final int REQ_CODE_AUDIO = 200;
    final int REQ_CODE_VIDEO = 300;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_write_post);

        mEditTextTitle = (EditText) findViewById(R.id.editTextTitle);
        mEditTextContent = (EditText) findViewById(R.id.editTextContent);
        mButtonWrite = (Button) findViewById(R.id.buttonWrite);
        mButtonAddImage = (Button) findViewById(R.id.buttonAddImage);
        mButtonAddMedia = (Button) findViewById(R.id.buttonAddMedia);

        mButtonWrite.setOnClickListener(mBtnWriteOnClickListener);
        mButtonAddImage.setOnClickListener(mBtnAddImageOnClickListener);
        mButtonAddMedia.setOnClickListener(mBtnAddMediaOnClickListener);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //super.onActivityResult(requestCode, resultCode, data);
        if(resultCode == Activity.RESULT_OK)
        {
            String path = null;
            String name = null;

            switch (requestCode)
            {
                case REQ_CODE_IMAGE:
                    getMediaFileInfo(path, name, data, MediaStore.Images.Media.DATA);
                break;

                case REQ_CODE_AUDIO:
                    getMediaFileInfo(path, name, data, MediaStore.Audio.Media.DATA);
                    break;

                case REQ_CODE_VIDEO:
                    getMediaFileInfo(path, name, data, MediaStore.Video.Media.DATA);
                    break;

                default:
                    break;
            }

            Log.d("WritePost", "Path : " + path);
            Log.d("WritePost", "Name : " + name);
        }
    }

    public void getMediaFileInfo(String path, String name, Intent data, String mediaStore)
    {
        Cursor cursor = null;
        String[] proj = {mediaStore};
        int column_index = 0;

        cursor = managedQuery(data.getData(), proj, null, null, null);
        column_index = cursor.getColumnIndexOrThrow(proj[0]);
        cursor.moveToFirst();
        path = cursor.getString(column_index);
        name = path.substring(path.lastIndexOf("/")+1);
        //Log.d("WritePost", "Path : " + path);
        //Log.d("WritePost", "Name : " + name);
    }

    Button.OnClickListener mBtnAddMediaOnClickListener = new View.OnClickListener() {
        public void onClick(View v) {
            Log.d("WritePost", "Add media clicked");

            Intent intent = new Intent(Intent.ACTION_PICK);
            intent.setType(android.provider.MediaStore.Audio.Media.CONTENT_TYPE);
            intent.setData(android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, REQ_CODE_AUDIO);
        }
    };

    Button.OnClickListener mBtnAddImageOnClickListener = new View.OnClickListener() {
        public void onClick(View v) {
            Log.d("WritePost", "Add image clicked");

            Intent intent = new Intent(Intent.ACTION_PICK);
            intent.setType(android.provider.MediaStore.Images.Media.CONTENT_TYPE);
            intent.setData(android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, REQ_CODE_IMAGE);
        }
    };

    Button.OnClickListener mBtnWriteOnClickListener = new View.OnClickListener() {
        public void onClick(View v) {
            Log.d("WritePost", mEditTextTitle.getText().toString());
            Log.d("WritePost", mEditTextContent.getText().toString());

            new Thread() {
                public void run() {
                    JSONObject json = new JSONObject();
                    try {
                        json.put("TEST", "Object");
                        json.put("Title", mEditTextTitle.getText().toString());
                        json.put("Content", mEditTextContent.getText().toString());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    LoginActivity.excutePost("http://192.168.11.105:5000/", json);
                }
            }.start();
        }
    };
}
