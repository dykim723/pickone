package com.team.audiomixer.audiomixer;

import android.content.Intent;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import java.util.ArrayList;

/**
 * Created by dc.shin on 2017-02-25.
 */

public class CardListAdapter extends RecyclerView.Adapter<CardListAdapter.ViewHolder>  {
    private ArrayList<CardListItemData> mDataset;

    // Provide a reference to the views for each data item
    // Complex data items may need more than one view per item, and
    // you provide access to all the views for a data item in a view holder
    public static class ViewHolder extends RecyclerView.ViewHolder {
        // each data item is just a string in this case
        public TextView mTextViewUserId;
        public TextView mTextViewContent;
        public TextView mTextViewMusicInfo;
        public Button mBtnPlayer;
        public Button mBtnLike;
        public Button mBtnReply;
        public int mBoardNo;

        public ViewHolder(View v) {
            super(v);
            mTextViewUserId = (TextView) v.findViewById(R.id.textViewUserId);
            mTextViewContent = (TextView) v.findViewById(R.id.textViewContent);
            mTextViewMusicInfo = (TextView) v.findViewById(R.id.textViewMusicInfo);
            mBtnPlayer = (Button) v.findViewById(R.id.buttonPlayer);
            mBtnLike = (Button) v.findViewById(R.id.buttonLike);
            mBtnReply = (Button) v.findViewById(R.id.buttonReply);

            v.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d("CardListAdapter", "onClick");
                    Intent intent = new Intent(v.getContext(), MixingActivity.class);
                    v.getContext().startActivity(new Intent(v.getContext(),MixingActivity.class));
                    intent.putExtra("BOARD_NO", mBoardNo);
                    v.getContext().startActivity(intent);
                }
            });
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    public CardListAdapter(ArrayList<CardListItemData> userDataset) {
        mDataset = userDataset;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public CardListAdapter.ViewHolder onCreateViewHolder(ViewGroup parent,
                                                         int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.card_list_item, parent, false);
        // set the view's size, margins, paddings and layout parameters
        ViewHolder vh = new ViewHolder(v);
        return vh;
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element
        holder.mTextViewUserId.setText(mDataset.get(position).mUserId);
        holder.mTextViewContent.setText(mDataset.get(position).mContent);
        holder.mTextViewMusicInfo.setText(mDataset.get(position).mMusicInfo);
        holder.mBoardNo = mDataset.get(position).mBoardNo;
        Log.d("CardListAdapter", "onBindViewHolder");
    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return mDataset.size();
    }
}

class CardListItemData{
    public String mUserId;
    public String mContent;
    public String mMusicInfo;
    public int mBoardNo;

    public CardListItemData(String title, String content, String musicInfo, int boardNo){
        this.mUserId = title;
        this.mContent = content;
        this.mMusicInfo = musicInfo;
        this.mBoardNo = boardNo;
    }
}

