import React, { useState } from "react";
import FormButton from "../form/FormButton";
import PaginationComponent from "./PaginationComp";
import { formatDate } from "../../Library/Common";
import { getStatusStyles } from "../../Library/Precedence";
import TransparentBtn from "../form/TransparentBtn";

const MetricTable = ({ bookings, tableTitle }) => {
  console.log("ddd", bookings);
  const [sortOption, setSortOption] = useState("alphabetical");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedBookings = [...bookings]?.sort((a, b) => {
    if (sortOption === "alphabetical") {
      return a?.username?.localeCompare(b?.username);
    } else if (sortOption === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const sortedPaginatedBookings = sortedBookings?.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(bookings?.length / itemsPerPage);

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const exportTableToCSV = () => {
    // Implementation of CSV export
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">
              {tableTitle} Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor user accounts and their statuses.
            </p>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="sort"
              className="text-sm font-medium text-gray-700 mr-2"
            >
              Sort:
            </label>
            <select
              value={sortOption}
              id="sort"
              name="sort"
              onChange={handleSortChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="recent">Recent</option>
            </select>
            <FormButton title="Download CSV" onClick={exportTableToCSV} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Full Name",
                "Email Address",
                "Phone Number",
                "Country",
                "City",

                // Truck Info
                "Truck Name",
                "Truck Model",

                // Delivery Info
                "Pickup Address",
                "Pickup state",
                "Pickup Country",
                "Delivery Address",
                "Delivery state",
                "Delivery Country",

                // appointment info
                "Appointment Date",
                "Appointment Time",

                "Status",
                "Created At",
                "Action",
              ]?.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPaginatedBookings?.map((user) => {
              const statusInfo = getStatusStyles(user?.status);

              return (
                <tr key={user?.id}>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user?.profile_pictures}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.username}
                        </div>
                      </div>
                    </div>
                  </td> */}

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.userProfile?.fullname}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.userProfile?.User?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.userProfile?.User?.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.userProfile?.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.userProfile?.city}
                    </div>
                  </td>

                  {/* Truck Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.listingData?.car_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.listingData?.model}
                    </div>
                  </td>

                  {/* Delivery Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.pickupLocation?.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.pickupLocation?.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.pickupLocation?.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.deliveryLocation?.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.deliveryLocation?.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.deliveryLocation?.country}
                    </div>
                  </td>

                  {/* Appointment info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.appointmentTime?.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user?.appointmentTime?.time}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.bgClass} ${statusInfo.textClass}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formatDate(user?.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TransparentBtn title={"View"} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-200">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={bookings?.length}
          itemsPerPage={itemsPerPage}
          onPrev={prevPage}
          onNext={nextPage}
        />
      </div>
    </div>
  );
};

export default MetricTable;
