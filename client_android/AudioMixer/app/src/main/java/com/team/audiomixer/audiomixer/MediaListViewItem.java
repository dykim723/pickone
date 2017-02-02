package com.team.audiomixer.audiomixer;

import android.widget.Button;

/**
 * Created by home on 2017-01-29.
 */

public class MediaListViewItem {
    private String titleStr;
    private Button selectBtn;

    public void setSelectBtn(Button btn) { selectBtn = btn; }
    public void setSelectBtnText(String text) { selectBtn.setText(text); }
    public void setTitle(String title) {
        titleStr = title;
    }
    public String getTitle() {
        return this.titleStr ;
    }
}