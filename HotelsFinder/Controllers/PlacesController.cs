using HotelsFinder.Domain;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace HotelsFinder.Controllers
{
    [Produces("application/json")]
    [Route("api/Places")]
    public class PlacesController : Controller
    {
        private readonly IPlaceRepository _placeRepository;

        public PlacesController(IPlaceRepository placeRepository)
        {
            _placeRepository = placeRepository;
        }

        [HttpGet("{fileName}")]
        [Produces(typeof(Place))]
        public async Task<IActionResult> GetPlace(string fileName)
        {
            var item = await Task.Run(() => _placeRepository.Get(fileName));
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }
    }
}