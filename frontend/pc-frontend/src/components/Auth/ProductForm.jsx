
import { useEffect, useState } from 'react';
import axios from 'axios';
import { productData, countries } from './Categories';
import { useLocation } from 'react-router-dom';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [superCategory, setSuperCategory] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [noOfUnits, setNoOfUnits] = useState('');
  const [siUnits, setSiUnits] = useState('Kg');
  const [unitWeight, setUnitWeight] = useState('');
  const [netWeight, setNetWeight] = useState('0');
  const [grossWeight, setGrossWeight] = useState('');
  const [description, setDescription] = useState('');
  const [nutrition, setNutrition] = useState({
    calories: '',
    fat: '',
    saturatedFat: '',
    carbs: '',
    fiber: '',
    sugar: '',
    protein: '',
    salt: '',
  });
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('');
  const [storage, setStorage] = useState('');
  const [origin, setOrigin] = useState('');
  const [files, setFiles] = useState([]);
  const [productIdPrefix, setProductIdPrefix] = useState('');
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    if (superCategory && category && subCategory) {
      setProductIdPrefix(`${superCategory}-${category}-${subCategory}`);
    }
  }, [superCategory, category, subCategory]);

  useEffect(() => {
    if (noOfUnits && unitWeight) {
      setNetWeight(noOfUnits * unitWeight);
    }
  }, [noOfUnits, unitWeight]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setNutrition({ ...nutrition, [name]: value });
  };

  const selectedSuperCategory = productData.find(sc => sc._id === superCategory)?.name || '';
  const selectedCategory = productData.find(sc => sc._id === superCategory)
    ?.categories.find(cat => cat._id === category)?.name || '';
  const selectedSubCategory = productData.find(sc => sc._id === superCategory)
    ?.categories.find(cat => cat._id === category)
    ?.subCategories.find(sub => sub._id === subCategory)?.name || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productBrand', productBrand);
    formData.append('superCategory',selectedSuperCategory);
    formData.append('category', selectedCategory);
    formData.append('subCategory', selectedSubCategory);
    formData.append('numberOfUnits', noOfUnits);
    formData.append('siUnits', siUnits);
    formData.append('unitWeight', unitWeight);
    formData.append('netWeight', netWeight);
    formData.append('grossWeight', grossWeight);
    formData.append('productDescription', description);
    formData.append('calories', nutrition.calories);
    formData.append('fat', nutrition.fat);
    formData.append('saturatedFat', nutrition.saturatedFat);
    formData.append('carbs', nutrition.carbs);
    formData.append('fibre', nutrition.fiber);
    formData.append('sugar', nutrition.sugar);
    formData.append('protein', nutrition.protein);
    formData.append('salt', nutrition.salt);
    formData.append('ingredients', ingredients);
    formData.append('dietary', dietary);
    formData.append('storage', storage);
    formData.append('origin', origin);
    
    files.forEach((file) => {
      formData.append('uploadImage', file);
      console.log(file.name)
    });

    try {
      const response = await axios.post('http://localhost:8000/api/v1/registerProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      if (response.status === 200) {
        alert('Product created successfully');
        setProductName('');
        setProductBrand('');
        setSuperCategory('');
        setCategory('');
        setSubCategory('');
        setNoOfUnits('');
        setSiUnits('Kg');
        setUnitWeight('');
        setNetWeight('0');
        setGrossWeight('');
        setDescription('');
        setNutrition({
          calories: '',
          fat: '',
          saturatedFat: '',
          carbs: '',
          fiber: '',
          sugar: '',
          protein: '',
          salt: '',
        });
        setIngredients('');
        setDietary('');
        setStorage('');
        setOrigin('');
        setProductIdPrefix('');
        setFiles([]);
      } else {
        alert('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('There was an error creating the product');
    }
  };

  const getCategories = (superCategoryId) => {
    const superCategoryData = productData.find((data) => data._id === superCategoryId);
    return superCategoryData ? superCategoryData.categories : [];
  };

  const getSubCategories = (superCategoryId, categoryId) => {
    const superCategoryData = productData.find((data) => data._id === superCategoryId);
    if (!superCategoryData) return [];
    const categoryData = superCategoryData.categories.find((cat) => cat._id === categoryId);
    return categoryData ? categoryData.subCategories : [];
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
        />
      </div>
      <div>
        <label>Product Brand</label>
        <input
          type="text"
          value={productBrand}
          onChange={(e) => setProductBrand(e.target.value)}
          placeholder="Product Brand"
        />
      </div>
      <div>
        <label>Select Category</label>
        <select
          value={superCategory}
          onChange={(e) => {
            setSuperCategory(e.target.value);
            setCategory(''); // Reset category and subcategory when supercategory changes
            setSubCategory('');
          }}
        >
          <option value="">Select Super Category</option>
          {productData.map((sc) => (
            <option key={sc._id} value={sc._id}>
              {sc.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory(''); // Reset subcategory when category changes
          }}
          disabled={!superCategory}
        >
          <option value="">Select Category</option>
          {getCategories(superCategory).map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          disabled={!category}
        >
          <option value="">Select Subcategory</option>
          {getSubCategories(superCategory, category).map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>No of Units</label>
        <input
          type="text"
          value={noOfUnits}
          onChange={(e) => setNoOfUnits(e.target.value)}
          placeholder="No. of units"
        />
      </div>
      <div>
        <label>Si Unit</label>
        <select
          value={siUnits}
          onChange={(e) => setSiUnits(e.target.value)}
        >
          <option value="Kg">Kg</option>
          <option value="g">g</option>
          <option value="L">L</option>
          <option value="mL">mL</option>
        </select>
      </div>
      <div>
        <label>Unit Weight</label>
        <input
          type="text"
          value={unitWeight}
          onChange={(e) => setUnitWeight(e.target.value)}
          placeholder="Unit Weight"
        />
      </div>
      <div>
        <label>Net Weight</label>
        <input
          type="text"
          value={netWeight}
          readOnly
          placeholder="Net Weight"
        />
      </div>
      <div>
        <label>Gross Weight</label>
        <input
          type="text"
          value={grossWeight}
          onChange={(e) => setGrossWeight(e.target.value)}
          placeholder="Gross Weight"
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        ></textarea>
      </div>
      <div>
        <label>Calories</label>
        <input
          type="text"
          name="calories"
          value={nutrition.calories}
          onChange={handleNutritionChange}
          placeholder="Calories"
        />
      </div>
      <div>
        <label>Fat</label>
        <input
          type="text"
          name="fat"
          value={nutrition.fat}
          onChange={handleNutritionChange}
          placeholder="Fat"
        />
      </div>
      <div>
        <label>Saturated Fat</label>
        <input
          type="text"
          name="saturatedFat"
          value={nutrition.saturatedFat}
          onChange={handleNutritionChange}
          placeholder="Saturated Fat"
        />
      </div>
      <div>
        <label>Carbs</label>
        <input
          type="text"
          name="carbs"
          value={nutrition.carbs}
          onChange={handleNutritionChange}
          placeholder="Carbs"
        />
      </div>
      <div>
        <label>Fiber</label>
        <input
          type="text"
          name="fiber"
          value={nutrition.fiber}
          onChange={handleNutritionChange}
          placeholder="Fiber"
        />
      </div>
      <div>
        <label>Sugar</label>
        <input
          type="text"
          name="sugar"
          value={nutrition.sugar}
          onChange={handleNutritionChange}
          placeholder="Sugar"
        />
      </div>
      <div>
        <label>Protein</label>
        <input
          type="text"
          name="protein"
          value={nutrition.protein}
          onChange={handleNutritionChange}
          placeholder="Protein"
        />
      </div>
      <div>
        <label>Salt</label>
        <input
          type="text"
          name="salt"
          value={nutrition.salt}
          onChange={handleNutritionChange}
          placeholder="Salt"
        />
      </div>
      <div>
        <label>Ingredients</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients"
        ></textarea>
      </div>
      <div>
        <label>Dietary</label>
        <select value={dietary} onChange={(e) => setDietary(e.target.value)}>
          <option value="">Select an option</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Lactose Free">Lactose Free</option>
          <option value="Gluten Free">Gluten Free</option>
          <option value="Gluten Free">Non-Vegetarian</option>
        </select>
      </div>
      <div>
        <label>Storage</label>
        <input
          type="text"
          value={storage}
          onChange={(e) => setStorage(e.target.value)}
          placeholder="Storage"
        />
      </div>
      <div>
        <label>Origin</label>
        <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
          <option value="">Select a Country</option>
        
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Product ID Prefix</label>
        <input type="text" value={productIdPrefix} readOnly />
      </div>

      
      <div>
        <label>Added By</label>
        <input
          type="text"
          value={data.info.name}
          placeholder="Added By"
          readOnly
        />
      </div>
      <div>
        <label>Upload Images</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
        />
      </div>
      <button>Save</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;















