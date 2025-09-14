import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import axios from "axios";
import {
  createProduct,
  updateProduct,
} from "../../redux/slices/adminProductSlice";
import { toast } from "sonner";

const ProductFormPage = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const initialProductData = {
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "Unisex",
    images: [],
    isFeatured: false,
    isPublished: false,
    tags: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
  };

  const [productData, setProductData] = useState(initialProductData);
  const [uploading, setUploading] = useState(false); // Image uploading state
  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    } else {
      setProductData(initialProductData);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct && id) {
      setProductData({
        ...initialProductData,
        ...selectedProduct,
        dimensions: selectedProduct.dimensions || initialProductData.dimensions,
      });

      setSizesInput(selectedProduct.sizes?.join(", ") || "");
      setColorsInput(selectedProduct.colors?.join(", ") || "");
      setTagsInput(selectedProduct.tags?.join(", ") || "");
    } else if (!id) {
      setSizesInput("");
      setColorsInput("");
      setTagsInput("");
    }
  }, [selectedProduct, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      toast.loading("Uploading image...", { id: "upload" });

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { Authorization: { "Content-Type": "multipart/form-data" } },
        }
      );

      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      toast.success("Image uploaded successfully!", { id: "upload" });

      setUploading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Please try again.", {
        id: "upload",
      });
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (productData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (
      productData.sizes.length === 0 ||
      (productData.sizes.length === 1 && productData.sizes[0] === "")
    ) {
      toast.error("Please add at least one size");
      return;
    }

    if (
      productData.colors.length === 0 ||
      (productData.colors.length === 1 && productData.colors[0] === "")
    ) {
      toast.error("Please add at least one color");
      return;
    }

    const loadingMessage =
      type === "update" ? "Updating product..." : "Creating product...";
    toast.loading(loadingMessage, { id: "product-action" });

    try {
      if (type === "update") {
        dispatch(updateProduct({ id, productData }));
        toast.success("Product updated successfully!", {
          id: "product-action",
        });
      } else if (type === "create") {
        dispatch(createProduct(productData));
        toast.success("Product created successfully!", {
          id: "product-action",
        });
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        id: "product-action",
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">
        {type === "update" ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>
        {/* Price and Discount Price */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">
              Discount Price (Optional)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={productData.discountPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        {/* Count In Stock and SKU */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2">Count in Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>
        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
            placeholder="e.g., T-Shirts, Jeans, Sneakers"
          />
        </div>
        {/* Brand */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Collections */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Collections</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
            placeholder="e.g., Summer 2025, New Arrivals"
          />
        </div>
        {/* Material */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Material</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
            onBlur={() =>
              setProductData({
                ...productData,
                sizes: sizesInput
                  .split(",")
                  .map((size) => size.trim())
                  .filter((size) => size),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., S, M, L, XL"
            required
          />
        </div>
        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            onBlur={() =>
              setProductData({
                ...productData,
                colors: colorsInput
                  .split(",")
                  .map((color) => color.trim())
                  .filter((color) => color),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., Red, Blue, Black"
            required
          />
        </div>
        {/* Tags */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onBlur={() =>
              setProductData({
                ...productData,
                tags: tagsInput
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., casual, summer, cotton"
          />
        </div>
        {/* Weight */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={productData.weight}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            min="0"
            step="0.01"
            placeholder="0.5"
          />
        </div>
        {/* Dimensions */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Dimensions (cm)</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Length</label>
              <input
                type="number"
                value={productData.dimensions.length}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    dimensions: {
                      ...productData.dimensions,
                      length: Number(e.target.value),
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Width</label>
              <input
                type="number"
                value={productData.dimensions.width}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    dimensions: {
                      ...productData.dimensions,
                      width: Number(e.target.value),
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Height</label>
              <input
                type="number"
                value={productData.dimensions.height}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    dimensions: {
                      ...productData.dimensions,
                      height: Number(e.target.value),
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>
        {/* Product Status Checkboxes */}
        <div className="mb-6">
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={productData.isFeatured}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    isFeatured: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Featured Product
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={productData.isPublished}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    isPublished: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Published
            </label>
          </div>
        </div>
        {/* SEO Meta Fields */}
        <div className="mb-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">SEO Meta Information</h3>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={productData.metaTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="SEO title for search engines"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Meta Description</label>
            <textarea
              name="metaDescription"
              value={productData.metaDescription}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              placeholder="Brief description for search engines"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={productData.metaKeywords}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Keywords for SEO, comma-separated"
            />
          </div>
        </div>
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading image...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 hover:bg-green-600 rounded-md transition-colors"
        >
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductFormPage;
