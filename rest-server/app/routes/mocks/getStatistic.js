const getVidIqHotterSearch = {
  'keywords': [
    {
      'keyword': 'genshin impact',
      'related_score': 7.499999999999997,
      'competition': 60.02683763232444,
      'volume': 95.60377303915828,
      'overall': 67.78846770341693,
      'estimated_monthly_search': 29907426.0,
      'updated_at': '2021-11-23T15:11:11Z',
      'query_shares': {
        'lyre genshin impact songs': 7.499999999999997
      },
      'wc_bonus': 1.2500000000000004
    },
    {
      'keyword': 'windsong lyre',
      'related_score': 4.799999999999999,
      'competition': 36.14134486357537,
      'volume': 61.00445549676864,
      'overall': 62.431555316596636,
      'estimated_monthly_search': 58921.01237071662,
      'updated_at': '2021-11-23T15:11:11Z',
      'query_shares': {
        'lyre genshin impact songs': 4.799999999999999
      },
      'wc_bonus': 0.8
    },
    {
      'keyword': 'lyre',
      'related_score': 3.5,
      'competition': 41.74742806023558,
      'volume': 61.67232467599643,
      'overall': 59.96244830788042,
      'estimated_monthly_search': 66449.92943802624,
      'updated_at': '2021-11-23T15:11:11Z',
      'query_shares': {
        'lyre genshin impact songs': 3.5
      }
    }
  ],
  'search_stats': {
    'views_count': {
      'min': 7,
      'max': 1144864,
      'mean': 165334.66
    },
    'likes_count': {
      'min': 0,
      'max': 96269,
      'mean': 10699.08
    },
    'dislikes_count': {
      'min': 0,
      'max': 317,
      'mean': 36.4
    },
    'comments_count': {
      'min': 0,
      'max': 2460,
      'mean': 257.72
    },
    'hd_count': 50,
    'cc_count': 0,
    'three_d_count': 0,
    'videos_found': 50,
    'seven_days_count': 1,
    'age': {
      'min': 1616737829.0,
      'max': 1637079544.0,
      'mean': 1622209977.68
    },
    'compvol': {//only this part of response we interested in
      'lyre genshin impact songs': {// tag name - each time equal to value you send for request
        'volume': 54.6343912776862,// volume rank (in percent): high is good, low is bad
        'competition': 35.06783957059788,// concurrency rank (in percent): less is better
        'overall': 59.783275853544154,// rank by vidIQ (in percent): high is good, low is bad
        'estimated_monthly_search': 18713.72442631301//number of monthly search request by this tag
      }
    }
  },
  'omitted': 25
};

module.exports = { getVidIqHotterSearch };
