import { useEffect, useRef, useState, useCallback } from 'react';
import './index.css'
import {Button, Card, CardImg} from 'react-bootstrap';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';


const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE =6;

function App() {
  const searchInput =  useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);

  const fetchImages = useCallback(async () => {
    try {
      if(searchInput.current.value){
        const {data} = await axios.get(`${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`);
        setTotalPages(data.total_pages);
      }
    }catch (error) {
     console.log(error);
    }
   },[page]);


  useEffect(() => {
    fetchImages();
  },[fetchImages]);


  const resetSearch = () => {
    setPage(1);
    fetchImages();
  }  

  const handleSearch = (event) =>{
    event.preventDefault();
    console.log(searchInput.current.value);
    resetSearch();
  }
  const handleSelection = (selection) =>{
    searchInput.current.value = selection;
    resetSearch();
  }
  return(
  <div className='container'>
    <div className="search-section">
      <SearchIcon id="search-icon" onClick={handleSearch}/>
    <input type="search" placeholder="Search Images here" className='search-input' ref={searchInput}/>
    </div>
    <div className="filters">
      <div onClick={() => handleSelection('nature')}>Nature</div>
      <div onClick={() => handleSelection('birds')}>Birds</div>
      <div onClick={() => handleSelection('cats')}>Cats</div>
      <div onClick={() => handleSelection('shoes')}>Shoes</div>
    </div>
    <div className="images" >
      {
        images.map(image => (
          <div key={image.id} className="image-container">
            <Card style={{ width: '22rem',height:'400px', border:'solid'}} className="image">
          <CardImg style={{ width: '100%', height:'300px'}} variant="top" src={image.urls.small} alt ={image.alt_description} />
          <Card.Body>
          <Card.Text>
          <p className="image-alt">{image.alt_description}</p>
          </Card.Text>
          </Card.Body>
          </Card>
          </div>
        ))
      }
    </div>
      <div className="buttons">
      {/* show only if the page is not number 1 */}
        {page > 1 &&  <Button onClick={() => setPage(page - 1)}>Previous</Button>} 
      {/* don't show in last page   */}
        {page < totalPages &&  <Button onClick={() => setPage(page + 1)}>Next</Button>} 
      </div>
  </div>
  )
}

export default App
