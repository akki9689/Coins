import React, { useState, useEffect } from 'react';

function CryptoTable() {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortKey, setSortKey] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
    
    fetch(url)
      .then(response => response.json())
      .then(data => setCryptoData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const handleSort = (key) => {
    setSortKey(key);
  };

  const filteredData = cryptoData.filter(item =>
    item.name.toLowerCase().includes(searchText) || item.symbol.toLowerCase().includes(searchText)
  );

  const sortedData = sortKey ?
    [...filteredData].sort((a, b) => {
      const aValue = parseFloat(a[sortKey]); // Use sortKey instead of key
      const bValue = parseFloat(b[sortKey]); // Use sortKey instead of key
      return sortKey === 'market_cap' ? bValue - aValue : aValue - bValue;
    }) :
    filteredData;

  return (
    <div className='container'>
     <div className='searchbar'>
     <input type="text" value={searchText} onChange={handleSearch} placeholder="Search by name or symbol"/>
      <button onClick={() => handleSort('market_cap')}>Sort by Market Cap</button>
      <button onClick={() => handleSort('price_change_percentage_24h')}>Sort by 24h Change</button>
     </div>
     <div className='table'>
     <table>
        <thead>
          <tr>
            <th id='image-head'></th>
            <th>Name</th>
            <th >Symbol</th>
            <th>Price (USD)</th>
            <th>Volume</th>
            <th>Market Cap</th>
            <th>24h Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(item => (
            <tr key={item.id}>
                <td id='image-head'><img src={item.image}/></td>
              <td>{item.name}</td>
              <td id='symbol'>{item.symbol}</td>
              <td>{item.current_price}</td>
              <td>{item.total_volume}</td>
              <td>{item.market_cap}</td>
              <td className={item.price_change_percentage_24h<0?'red':'green'}>{item.price_change_percentage_24h}</td>
            </tr>
          ))}
        </tbody>
      </table>
     </div>
    </div>
  );
}

export default CryptoTable;
