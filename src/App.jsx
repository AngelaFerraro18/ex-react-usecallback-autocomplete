import { useCallback, useEffect, useState } from "react"

function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => { callback(value) }, delay)
  }
}


function App() {

  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  async function productsFetch(query) {
    try {
      const response = await fetch(`http://localhost:3333/products?search=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]);
    }

  }

  useEffect(() => { productsFetch(search) }, [])

  const debouncedFetch = useCallback(debounce((query) => { productsFetch(query); }, 500), []);

  return (
    <>
      <input type="text"
        value={search}
        onChange={e => {
          setSearch(e.target.value);

          if (!e.target.value.trim()) {
            setResults([]);
            return
          }

          debouncedFetch(e.target.value);
        }} />

      {

        search.trim() && results.length > 0 && (<ul>
          {results.map(r => <li key={r.id}>
            <h3>{r.name}</h3>
            <p><strong>{r.brand}</strong></p>
            <img src={r.image} alt={r.name} />
            <p>{r.description}</p>
          </li>)}
        </ul>)}


    </>
  )
}

export default App
