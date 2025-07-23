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
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const debouncedFetch = useCallback(debounce(productsFetch, 500), []);

  useEffect(() => { debouncedFetch(search) }, [search]);

  async function fetchProductDetails(id) {

    try {
      const response = await fetch(`http://localhost:3333/products/${id}`);
      const data = await response.json();
      setSelectedProduct(data);
      setSearch('');
      setResults([]);
    } catch (error) {
      console.error(error);
    }
  }

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

      {search.trim() && results.length > 0 && (<ul>
        {results.map(r => <li key={r.id} onClick={() => fetchProductDetails(r.id)}>
          <h3>{r.name}</h3>
        </li>)}
      </ul>)}

      {selectedProduct && (<div>
        <h2>{selectedProduct.name}</h2>
        <img src={selectedProduct.image} alt={selectedProduct.name} />
        <p>{selectedProduct.description}</p>
      </div>)}


    </>
  )
}

export default App
