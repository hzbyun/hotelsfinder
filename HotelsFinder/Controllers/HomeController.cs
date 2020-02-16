
using Microsoft.AspNetCore.Mvc;

namespace HotelsFinder
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return Redirect("/default.htm");
        }
    }

}