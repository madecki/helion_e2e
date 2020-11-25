import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = 'e5dc1732cf7640568621add0d3ef08ca'

function App() {
  const [ selectedNewsType, setSelectedNewsType ] = useState('headlines');
  const [ query, setQuery ] = useState('');
  const [ dateFrom, setDateFrom ] = useState('');
  const [ dateTo, setDateTo ] = useState('');
  const [ newsList, updateNewsList ] = useState([]);
  const [ loadingStatus, setLoadingStatus ] = useState(null)

  const getNews = (event) => {
    event.preventDefault();

    if (selectedNewsType === 'headlines') {
      axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`).then((response) => {
        updateNewsList(response.data.articles)
      }).catch(() => {
        setLoadingStatus('error')
      })
    } else {
      axios.get(`https://newsapi.org/v2/everything?q=${query}&from=${dateFrom}&to=${dateTo}&apiKey=${API_KEY}`).then((response) => {
        updateNewsList(response.data.articles)
      }).catch(() => {
        setLoadingStatus('error')
      })
    }
  }

  return (
    <>
      <section className="container">
        <h1>Get latest news!</h1>

        <form onSubmit={getNews}>
          <div className="type-selection">
            <label for="typeSelection">Choose if you want to fetch headlines or custom selected news</label>
            <select
              onChange={event => {setSelectedNewsType(event.target.value)}}
              data-testid="news-type-selection"
              value={selectedNewsType}
              id="typeSelection"
            >
              <option value="headlines">Headlines</option>
              <option value="everything">Everything</option>
            </select>
          </div>

          {
            selectedNewsType === 'everything' && (
              <>
                <label for="query">Insert query</label>
                <input
                  id="query"
                  placeholder="I.e. holidays"
                  data-testid="news-query"
                  type="text"
                  onChange={event => {setQuery(event.target.value)}}
                  required="true"
                />
              
                <label for="date-from">Select starting date</label>
                <input
                  type="text"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                  placeholder="YYYY-MM-DD"
                  data-testid="news-date-from"
                  id="date-from"
                  value={dateFrom}
                  onChange={event => {setDateFrom(event.target.value)}}
                  // required="true"
                />

                <label for="date-to">Select starting date</label>
                <input
                  type="text"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                  placeholder="YYYY-MM-DD"
                  data-testid="news-date-to"
                  id="date-to"
                  value={dateTo}
                  onChange={event => {setDateTo(event.target.value)}}
                  // required="true"
                />
              </>
            )
          }
          {loadingStatus === 'error' && <div data-testid="news-error-alert" className="alert alert-danger">Couldn't fetch news data.</div>}

          <button
            className="btn btn-primary btn-get-news"
            type="submit"
            disabled={selectedNewsType === 'everything' && query.length === 0 ? true : false}
            data-testid="get-news"
          >
            Get news
          </button>
        </form>
      </section>

      <section className="container news-container">
        {newsList.map(news => {
          return (
            <div className="news" data-testid="news-element">
              <h2>{news.title}</h2>
              <img
                data-testid="news-img"
                src={news.urlToImage ? news.urlToImage : 'https://via.placeholder.com/150'}
                alt={news.description}
                className="news-img"
              />
              <p>{news.content}</p>
            </div>
          )
        })}
      </section>
    </>
  );
}

export default App;
