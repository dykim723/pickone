package com.team.audiomixer.audiomixer;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;

import java.util.ArrayList;

public class CardListActivity extends AppCompatActivity {
    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mCardListAdapter;
    private RecyclerView.LayoutManager mLayoutManager;
    private ArrayList<CardListItemData> mDataset;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_card_list);

        mRecyclerView = (RecyclerView) findViewById(R.id.recyclerView);

        // use this setting to improve performance if you know that changes
        // in content do not change the layout size of the RecyclerView
        mRecyclerView.setHasFixedSize(true);

        // use a linear layout manager
        mLayoutManager = new LinearLayoutManager(this);
        mRecyclerView.setLayoutManager(mLayoutManager);

        // specify an adapter (see also next example)
        mDataset = new ArrayList<>();
        mCardListAdapter = new CardListAdapter(mDataset);
        mRecyclerView.setAdapter(mCardListAdapter);

        mDataset.add(new CardListItemData("ID 테스트 1", "내용 테스트 1", "음악 테스트 1", 0));
        mDataset.add(new CardListItemData("ID 테스트 2", "내용 테스트 2", "음악 테스트 2", 0));
        mDataset.add(new CardListItemData("ID 테스트 3", "내용 테스트 3", "음악 테스트 3", 0));
        mDataset.add(new CardListItemData("ID 테스트 4", "내용 테스트 4", "음악 테스트 4", 0));
        mDataset.add(new CardListItemData("ID 테스트 5", "내용 테스트 5", "음악 테스트 5", 0));
        mDataset.add(new CardListItemData("ID 테스트 6", "내용 테스트 6", "음악 테스트 6", 0));
    }
}
