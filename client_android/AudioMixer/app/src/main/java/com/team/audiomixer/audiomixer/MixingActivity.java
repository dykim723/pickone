package com.team.audiomixer.audiomixer;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

public class MixingActivity extends AppCompatActivity {

    private Button mBtnStartMixing;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mixing);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        mBtnStartMixing = (Button)findViewById(R.id.btnStartMixing);

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
            Log.d("Start Mixing", "!!!!!");

            new Thread() {
                public void run() {
                    JSONObject json = new JSONObject();
                    try {
                        json.put("TEST", "Object");
                        json.put("Title", "Title");
                        json.put("Content", "Content");

                        LoginActivity.excuteGet("http://localhost:5000/mix/");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                }
            }.start();

        }
    };
}
