namespace HotelsFinder.Domain
{
	public interface IPlaceRepository
	{
		/// <summary>
		/// Gets a single place file file name, or null if not found.
		/// </summary>
		Place Get(string fileName);
	}
}