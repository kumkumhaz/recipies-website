
const burger = document.querySelector('.burger');
const rightNav = document.querySelector('.rightNav');
const like = document.getElementById("like");
const favorite = document.getElementById("favorite");
const recipies = document.getElementById("recipies");
const home = document.getElementById("home");
const recipe = document.getElementById("recipe");
const homepage = document.getElementById("homepage");

home.addEventListener("click", ()=>{
  favorite.style.display = "none";
  recipies.style.display = "block";
  homepage.style.display = "block";
})
recipe.addEventListener("click", () => {
  favorite.style.display = "none";
  recipies.style.display = "block";
});

burger.addEventListener('click', function(e) {
  e.stopPropagation();
  rightNav.classList.toggle('show');
});

document.addEventListener('click', function(e) {
  var target = e.target;
  var isRightNav = target.classList.contains('rightNav') || target.closest('.rightNav');

  if (!isRightNav) {
    rightNav.classList.remove('show');
  }
});

 
 //search functionality
 var searchInput = document.getElementById('search');
var searchIcon = document.getElementById('searchicon');

searchIcon.addEventListener('click', function() {
  searchInput.style.display = "block";
  searchInput.focus();
  searchIcon.style.display = "none";
});

const recipeItems = document.getElementsByClassName('recipeItem');
var scrollOffset = -100; // Adjustable offset value

searchInput.addEventListener('input', function() {
  var searchTerm = searchInput.value.toLowerCase();
  var recipeFound = false;
  var scrollToElement;

  // Loop through each recipe item
  for (var i = 0; i < recipeItems.length; i++) {
    var recipeItem = recipeItems[i];
    var recipeHeading = recipeItem.querySelector('.recipeHeading').innerText.toLowerCase();
    
    if (isSequentialMatch(recipeHeading, searchTerm)) {
      recipeItem.style.display = 'block';
      recipeFound = true;
      scrollToElement = recipeItem.querySelector('.recipeHeading');
    } else {
      recipeItem.style.display = 'none';
    }
  }

  // Scroll to the recipe heading if found
  if (recipeFound && scrollToElement) {
    var recipeSection = document.getElementById('recipies');
    var scrollTopOffset = scrollToElement.offsetTop - recipeSection.offsetTop + scrollOffset;
    window.scrollTo({ top: scrollTopOffset, behavior: 'smooth' });
  } else {
    // Show alert if no results found
    alert('No results found.');
  }
});

function isSequentialMatch(recipeHeading, searchTerm) {
  var sequenceIndex = 0;
  for (var i = 0; i < recipeHeading.length; i++) {
    if (recipeHeading[i] === searchTerm[sequenceIndex]) {
      sequenceIndex++;
      if (sequenceIndex === searchTerm.length) {
        return true;
      }
    }
  }
  return false;
}

// Event listener for clicking anywhere on the screen
document.addEventListener('click', function(event) {
  var target = event.target;

  // Check if the clicked element is outside the search bar
  if (target !== searchInput && target !== searchIcon) {
    searchInput.style.display = 'none';
    searchIcon.style.display = 'inline-block';
  }
});




//LIKED FUNCTIONALITY
const bookmark = document.getElementById("bookmark");
const likeButtons = document.querySelectorAll(".like");

likeButtons.forEach((likeButton, index) => {
  likeButton.addEventListener("click", () => {
    toggleLike(index);
    likeButton.classList.toggle("liked");
  });

  // Check if the recipe is already liked and set the "liked" class accordingly
  const recipeObj = {
    recipe: recipeItems[index].querySelector(".recipeHeading").textContent,
  };
  const likedRecipeIds = JSON.parse(localStorage.getItem("likedRecipeIds")) || [];
  if (likedRecipeIds.includes(getRecipeId(recipeObj))) {
    likeButton.classList.add("liked");
  }
});

// Function to toggle the "liked" status and save it to localStorage
function toggleLike(index) {
  const recipeObj = {
    recipe: recipeItems[index].querySelector(".recipeHeading").textContent
  };
  const recipeId = getRecipeId(recipeObj);
  const likedRecipeIds = JSON.parse(localStorage.getItem("likedRecipeIds")) || [];

  if (likedRecipeIds.includes(recipeId)) {
    // Recipe is already liked, so unlike it
    const updatedLikedRecipeIds = likedRecipeIds.filter(id => id !== recipeId);
    localStorage.setItem("likedRecipeIds", JSON.stringify(updatedLikedRecipeIds));
  } else {
    // Like the recipe
    likedRecipeIds.push(recipeId);
    localStorage.setItem("likedRecipeIds", JSON.stringify(likedRecipeIds));
  }

  // If the user is on the "Liked Recipes" page, update the displayed liked recipes
  if (window.location.pathname === "/liked_recipes.html") {
    showLikedRecipes();
  }
}

// Function to get a unique ID for each recipe
function getRecipeId(recipeObj) {
  // For simplicity, we are using the recipe name as the unique ID here
  return recipeObj.recipe.toLowerCase().replace(/\s/g, "-");
}

bookmark.addEventListener("click", () => {
  showLikedRecipes();
  favorite.style.display = "block";
  recipies.style.display = "none";
  homepage.style.display = "none";
});

// Function to display the liked recipes
function showLikedRecipes() {
  const likedRecipeIds = JSON.parse(localStorage.getItem("likedRecipeIds")) || [];

  // Create a container to display the liked recipes in the bookmark section
  const likedRecipesContainer = document.getElementById("likedRecipesContainer");
  likedRecipesContainer.innerHTML = ""; // Clear previous content

  // Iterate through the liked recipe IDs and find the corresponding recipes
  likedRecipeIds.forEach(likedId => {
    const recipeItem = findRecipeByUniqueId(likedId);
    if (recipeItem) {
      // Clone the entire recipe item and append it to the container
      const favheading = document.getElementById("favheading");
    favheading.style.display = "block";
      const clonedRecipeItem = recipeItem.cloneNode(true);
      const likeButton = clonedRecipeItem.querySelector(".like");
      likeButton.addEventListener("click", () => {
        toggleLike([...recipeItems].indexOf(recipeItem)); // Update the heart icon from the liked page
        likeButton.classList.remove("liked"); // Remove the "liked" class to turn the heart black
        showLikedRecipes(); // Refresh the liked recipes display
      });
      likedRecipesContainer.appendChild(clonedRecipeItem);
    }
  });

  // Show a message if there are no liked recipes
  if (likedRecipeIds.length === 0) {
    const messageElement = document.createElement("div");
    messageElement.textContent = "Suggest a good one from your side";
    likedRecipesContainer.appendChild(messageElement);
    const favheading = document.getElementById("favheading");
    favheading.style.display = "none";
  }
}

// Function to find the recipe element by unique ID
function findRecipeByUniqueId(uniqueId) {
  // This function will find the recipe element based on the unique ID
  // Here, we are using the recipe name as the unique ID, so we'll search for the recipe with the matching name
  // You can modify this function based on your unique ID generation logic
  return [...recipeItems].find(recipeItem => {
    const recipeName = recipeItem.querySelector(".recipeHeading").textContent;
    const recipeId = getRecipeId({ recipe: recipeName });
    return recipeId === uniqueId;
  });
}
