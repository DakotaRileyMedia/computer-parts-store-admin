// src/router/categories.js
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Categories
// @route   GET /
router.get('/', ensureAuth, async (req, res) => {
  try {
    const categories = await Category.find({});
    // Fetch all categories including parent categories
    const allCategories = await Category.find();
    // Map category IDs to category names
    const categoryNamesById = allCategories.reduce((acc, category) => {
      acc[category._id.toString()] = category.name;
      return acc;
    }, {});
    // Save the error to errorMessage
    const errorMessage = req.flash('error');
    res.render('categories/index', {
      categories: categories,
      errorMessage: errorMessage,
      categoryNamesById: categoryNamesById,
    });
  } catch {
    console.error('Error fetching categories:', error);
    req.flash('error', 'Error fetching categories');
    res.redirect('/');
  }
});

// @desc    Edit Category Page
// @route   GET categories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const allCategories = await Category.find();

    // Function to check if a category is an ancestor of another category
    const isAncestor = (category, potentialAncestor) => {
      if (!category || !category.parentCategory) {
        return false;
      } else if (potentialAncestor && category.parentCategory === potentialAncestor._id.toString()) {
        return true;
      } else {
        const parentCategory = allCategories.find((cat) => cat._id.toString === category.parentCategory);
        return isAncestor(parentCategory, potentialAncestor);
      }
    };

    // Filter out categories that are descendants of the category being edited
    // Also filter out the category being edited to prevent setting itself as parent
    const categories = allCategories.filter(
      (cat) => cat._id.toString() !== category._id.toString() && !isAncestor(category, cat)
    );

    // Find the parent category ID of the current category
    const parentId = category.parentCategory ? category.parentCategory.toString() : null;

    // If the parent category of the current category is already selected as its parent,
    // add it to the list of categories
    if (parentId && !categories.some((cat) => cat._id.toString() === category.parentCategory)) {
      const parentCategory = await Category.findById(category.parentCategory);
      if (parentCategory) {
        categories.push(parentCategory);
      }
    }

    // Map category IDs to category names
    const categoryNamesById = allCategories.reduce((acc, category) => {
      acc[category._id.toString()] = category.name;
      return acc;
    }, {});

    res.render('categories/edit', {
      category: category,
      categories: categories,
      categoryNamesById: categoryNamesById,
      parentId: parentId, // Pass the parent category ID to the template
    });
  } catch (err) {
    console.error(err);
    res.redirect('/categories');
  }
});

// @desc    Create Categories
// @route   POST products/
router.post('/', ensureAuth, async (req, res) => {
  const { name, parentCategory } = req.body;

  // Check if the name is empty
  if (!name) {
    req.flash('error', 'Category name cannot be empty');
    return res.redirect('/categories');
  }

  // Check if the parentCategory exists
  if (parentCategory) {
    try {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        req.flash('error', 'Parent category does not exist');
        return res.redirect('/categories');
      }
    } catch (err) {
      console.error('Error finding parent category:', err);
      req.flash('error', 'Error finding parent category');
      return res.redirect('/categories');
    }
  }

  // Create a new category object based on the incoming request
  const category = new Category({
    name: req.body.name,
    parentCategory: req.body.parentCategory,
  });

  try {
    // Try saving the new category
    const newCategory = await category.save();
    // If successful, redirect the user to the categories page
    res.redirect('/categories');
  } catch (error) {
    // Handle database save errors

    // Log the error for debugging purposes
    req.flash('Error saving category:', error);

    try {
      // Attempt to retrieve all categories from the database
      const categories = await Category.find();
      // Render the categories index view with an error message and the retrieved categories
      res.render('categories/index', {
        categories: categories,
        errorMessage: 'Error creating category',
      });
    } catch (findError) {
      // If an error occurs while trying to find categories, log the error
      req.flash('Error finding categories:', findError);
      // Render the categories index view with only an error message
      res.render('categories/index', {
        errorMessage: 'Error creating category',
      });
    }
  }
});

// @desc    Update Categories
// @route   PUT categories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  let category;

  const { name } = req.body;

  // Check if the name is empty
  if (!name) {
    req.flash('error', 'Category name cannot be empty');
    console.log('Category name cannot be empty');
    return res.redirect(`/categories/edit/${req.params.id}`);
  }

  try {
    category = await Category.findById(req.params.id);
    category.name = req.body.name;
    category.parentCategory = req.body.parentCategory;
    category.properties = req.body.properties;
    await category.save();
    res.redirect(`/categories`);
  } catch (error) {
    console.error('Error fetching categories:', error);
    req.flash('error', 'Error fetching categories'); // Set flash message
    res.redirect('/');
  }
});

// @desc    Delete Categories
// @route   DELETE categories/:id/delete
router.delete('/delete/:id', ensureAuth, async (req, res) => {
  try {
    // Check if any products are associated with the category to be deleted
    const productsWithCategory = await Product.find({ category: req.params.id });
    if (productsWithCategory.length > 0) {
      // If products are associated with the category, render an error message to the user
      req.flash('error', 'Cannot delete category associated with products.');
      return res.redirect('/categories'); // Redirect to appropriate page
    }

    // Check if any child categories exist for the parent category to be deleted
    const childCategories = await Category.find({ parentCategory: req.params.id });
    if (childCategories.length > 0) {
      // If child categories exist, render an error message to the user
      req.flash('error', 'Cannot delete parent category with existing child categories.');
      return res.redirect('/categories');
    }

    // If no child categories exist, proceed with deleting the parent category
    await Category.findByIdAndDelete(req.params.id);
    // Redirect to the categories page or send a success response
    res.redirect(`/categories`);
  } catch (err) {
    // Handle errors
    console.error('Error deleting category:', err);
    req.flash('error', 'Error deleting category');
    res.redirect('/categories');
  }
});

module.exports = router;
