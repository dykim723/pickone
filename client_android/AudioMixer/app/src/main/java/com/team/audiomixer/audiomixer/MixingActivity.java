package com.team.audiomixer.audiomixer;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.team.audiomixer.audiomixer.util.ServerConnUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

public class MixingActivity extends AppCompatActivity {

    private Button mBtnStartMixing;
    private int mBoardNo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mixing);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        mBtnStartMixing = (Button)findViewById(R.id.btnStartMixing);
        mBoardNo = getIntent().getIntExtra("BOARD_NO", 0);

        Toast.makeText(getApplicationContext(), "등록 성공 MixingActivity로 이동, BoadNo: " + mBoardNo, Toast.LENGTH_SHORT).show();

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        mBtnStartMixing.setOnClickListener(mBtnStartMixingClickListener);
    }

    Button.OnClickListener mBtnStartMixingClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            new Thread() {
                public void run() {
                    try {
                        ServerConnUtil.executeGet("192.168.219.5:5000", String.valueOf(mBoardNo));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                }
            }.start();

        }
    };
}
