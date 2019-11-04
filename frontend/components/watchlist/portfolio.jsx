import React from 'react';
import { Link } from 'react-router-dom';
import * as StocksAPIUtil from '../../util/stocks_api_util';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../dashboard/tooltip_content';
import WatchlistItem from "./watchlist_item";

class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolio: {},
            // watchlist: []
        }
        this.buildPortfolio = this.buildPortfolio.bind(this)
        this.buildWatchlist = this.buildWatchlist.bind(this)
        this.watchlist = [];

    }

    componentDidMount () {
        debugger
        Promise.all([
          this.props.allCompanies(),
          this.props.allTransactions(),
          this.props.allWatchlistItems()
        ]).then(response => {
          debugger;
          this.buildPortfolio();
        //   this.buildWatchlist();
        });
    }


    buildPortfolio() {
        
        let { companies, transactions } = this.props
        let portfolio = {};
        for (let i = 0; i < companies.length; i++) {
            let company = companies[i]
            for (let j = 0; j < transactions.length; j++) {
                let transaction = transactions[j]

                if (transaction.company_id === company.id && portfolio[company.ticker] === undefined) {
                    if (transaction.order_type) {
                        portfolio[company.ticker] = transaction.quantity
                    } else {
                        portfolio[company.ticker] = transaction.quantity * -1
                    }
                } else if (transaction.company_id === company.id && portfolio[company.ticker] !== undefined) {
                    if (transaction.order_type) {
                        portfolio[company.ticker] += transaction.quantity
                    } else {
                        portfolio[company.ticker] -= transaction.quantity
                    }
                }

            }
        }

          let dataWithoutZeros = {};
          for (let ticker in portfolio) {
            if (portfolio[ticker] !== 0) {
              dataWithoutZeros[ticker] = portfolio[ticker];
            }
          }
        
        this.setState({
            portfolio : dataWithoutZeros
        },() => {
            this.buildCharts(this.state.portfolio)
            this.buildWatchlist();
        })
        

    }

    buildCharts(data) {
        debugger
        // let dataWithoutZeros = {};
        // for (let ticker in data) {
        //     if (data[ticker] !== 0) {
        //         dataWithoutZeros[ticker] = data[ticker];
        //     }
        // }
        // let { portfolio } = this.state;
        debugger
        Object.keys(data).forEach(ticker => {
            const tick = ticker;
            Promise.all([StocksAPIUtil.getIntradayPrices(ticker), ticker, StocksAPIUtil.getLastPrice(ticker)])
            .then(response => {
                let ticker = response[1];
                let data = response[0];
                let price = response[2].last_price;
                let ticker_price = `${ticker}Price`
              
                // if (Array.isArray(response[0])) {
                //     data = response[0];
                //     ticker = response[1];
                // } else {
                //     data = response[1];
                //     ticker = response[0];
                // }
              
                this.setState({
                    [ticker]: data.slice(.93 * data.length),
                    [ticker_price] : price
                },() => {
                    debugger
                })

            })
        })
    }

    buildWatchlist() {
        let watchlist = [];
        let { watchlists } = this.props;
        debugger
        let watchlistWithoutPortfolio = [];
        watchlists.forEach(item => {
            if (this.state.portfolio[item.ticker] === undefined) {
                watchlistWithoutPortfolio.push(item)
            }
        })
        watchlistWithoutPortfolio.forEach((item, i) => {
            watchlist.push(
              <li key={i}>
                <WatchlistItem ticker={item.ticker} />
              </li>
            );
        })

        // return watchlist;

        this.watchlist = watchlist;
        debugger
        // let { watchlists } = this.props
        // if (watchlists.length === 0) return null;

        // watchlists.forEach(company => {
        //     let ticker = company.ticker;
        //     Promise.all([StocksAPIUtil.getIntradayPrices(ticker), ticker, StocksAPIUtil.getLastPrice(ticker)])
        //     .then(response => {
        //         let ticker = response[1];
        //         let data = response[0];
        //         let price = response[2].last_price;
        //         let ticker_price = `${ticker}Price`

        //         this.setState({
        //             watchlist: this.state.watchlist.push({
        //                 [ticker] : {
        //                     data,
        //                     price
        //                 }
        //             })
        //         },() => {
        //             debugger
        //         })

        //     })

        // })
    }





    render () {
        let {transactions, companies } = this.props;
        let { portfolio } = this.state;
        let portfolioComponent = [];
        // let watchlistComponent = []
        if (Object.keys(portfolio).length === 0) {
            portfolioComponent = null;
            // watchlistComponent = null;
        } else {
          
                Object.keys(portfolio).forEach((company, i) => {
                    let totalValue = this.state[`${company}Price`] * portfolio[company]
                    portfolioComponent.push(
                      <li key={i}>
                        <Link
                          className="watchlist-link"
                          to={`/stocks/${company}`}
                        >
                          <div>
                            <h1>{company}</h1>
                            <h2>
                              {portfolio[company]}{" "}
                              {portfolio[company] === 1 ? "share" : "shares"}
                            </h2>
                          </div>
                          <div className="watchlist-chart">
                            <LineChart
                              width={50}
                              height={50}
                              data={this.state[company]}
                            >
                              <XAxis
                                dataKey="minute"
                                hide={true}
                                domain={["dataMin", "dataMax"]}
                              />
                              <YAxis
                                hide={true}
                                domain={["dataMin", "dataMax"]}
                              />
                              <Line
                                type="monotone"
                                connectNulls
                                dataKey="close"
                                stroke="#34D199"
                                strokeWidth="1"
                                dot={false}
                              />
                            </LineChart>
                          </div>
                          <div className="portfolio-value">
                            ${" "}
                            {isNaN(totalValue.toFixed(2))
                              ? 0
                              : totalValue.toFixed(2)}
                          </div>
                        </Link>
                      </li>
                    );
                
                })
                // watchlistComponent = this.buildWatchlist();
            
        }

        return (
        
            <div className='watchlist'>

            <h1>Portfolio</h1> 
            <ul className='sidebar-ul'>
                {portfolioComponent}
            </ul>
            <h1 className='watchlist-heading'>Watchlist</h1>
            <ul className='sidebar-nav'>
                {this.watchlist}
            </ul>

            </div>
     
        )
    }

}

export default Portfolio;