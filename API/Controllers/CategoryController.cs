using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class CategoryController : BaseApiController
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IDealRepository _dealRepository;
        public CategoryController(ICategoryRepository categoryRepository, IDealRepository dealRepository)
        {
            _categoryRepository = categoryRepository;
            _dealRepository = dealRepository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Category>> GetCategories()
        {
            var categories = _categoryRepository.GetCategories();
            return Ok(categories);
        }

        [HttpGet("GetCategory/{categoryId}", Name = "GetCategory")]
        public async Task<ActionResult<Category>> GetCategory(int categoryId)
        {
            var category = await _categoryRepository.GetCategoryById(categoryId);
            return Ok(category);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Category>> Create(CaregoryDto categoryToAdd)
        {

            if (_categoryRepository.GetCategories().Any(c => c.Name == categoryToAdd.Name))
                return BadRequest("Caegory with the mentioned name is already exist");

            var category = new Category { Name = categoryToAdd.Name };
            _categoryRepository.Add(category);

            if (await _categoryRepository.SaveAllAsync())
                return CreatedAtRoute("GetCategory", new { categoryId = category.Id }, category);

            return BadRequest("Problem adding category");
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCategory(CaregoryDto categoryToUpdate)
        {
            if (_categoryRepository.GetCategories().Any(c => c.Name == categoryToUpdate.Name))
                return BadRequest("Caegory with the mentioned name is already exist");
            var category = await _categoryRepository.GetCategoryById(categoryToUpdate.Id);
            var oldCategoryName = category.Name;
            category.Name = categoryToUpdate.Name;

            if (await _dealRepository.ApplyCategoryChangesForProducts(oldCategoryName, category.Name))
            {
                try {
                    await _dealRepository.SaveAllAsync();
                }
                catch(Exception){
                    return BadRequest("Failed to update products");
                }      
            }

            _categoryRepository.Update(category);
            if (await _categoryRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update category");
        }

        [HttpDelete("{categoryId}")]
        public async Task<ActionResult> DeleteCategory(int categoryId)
        {
            var category = await _categoryRepository.GetCategoryById(categoryId);

            if (category == null) return NotFound();

            if (await _dealRepository.ApplyCategoryChangesForProducts(category.Name))
            {
                try {
                    await _dealRepository.SaveAllAsync();
                }
                catch(Exception){
                    return BadRequest("Failed to update products");
                }      
            }

            _categoryRepository.Remove(category.Id);
            if (await _categoryRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to delete the category");
        }
    }

}
