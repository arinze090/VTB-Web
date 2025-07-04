import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axiosInstance from "../../utils/api-client";
import {
  saveTruckListings,
  saveTruckOnwerTrucksListings,
} from "../../redux/features/user/userSlice";

import FormButton from "../../components/form/FormButton";
import TruckListingTable from "../../components/adminDashboard/TruckListingTable";
import { toast } from "react-toastify";
import DriverSelectionDisplay from "../../components/cards/DriverDisplayCards";
import Modal from "../../components/modal/Modal";

const Container = styled.div`
  padding-top: 130px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 60px;
  align-content: center;
  padding: auto;

  @media screen and (max-width: 768px) {
    padding-top: 70px;
    margin-bottom: 0px;
    height: auto;
  }
`;

function TruckListings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const reduxTruckListings = state?.user?.truckListings;
  const reduxTruckOwnersTrucksListings = state?.user?.truckOwnersTrucksListings;
  console.log("reduxTruckOwnersTrucksListings", reduxTruckOwnersTrucksListings);

  const [loading, setLoading] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const closeModal = () => {
    setOpenModal(!openModal);
  };

  const [selectedTruckForAssignment, setSelectedTruckForAssignment] =
    useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [truckOwnerDrivers, setTruckOwnerDrivers] = useState([]);
  const [driversListing, setDriverslisting] = useState([]);

  const [assignedDriverIds, setAssignedDriverIds] = useState([]);

  const fetchTruckListings = async () => {
    setLoading(true);

    try {
      const truckListingResponse = await axiosInstance({
        url: "api/listing/all-offerings",
        method: "GET",
      });

      console.log("truckListingResponse", truckListingResponse?.data);

      if (truckListingResponse?.data?.data) {
        const matchedResponses = truckListingResponse?.data?.data;

        const matchedResponseWithProfiles = await Promise.all(
          matchedResponses?.map(async (listing) => {
            const matchedDriverProfile = await getDriversProfile(
              listing?.driverId
            );
            return { ...listing, matchedDriverProfile };
          })
        );

        console.log("matchedResponseWithProfiles", matchedResponseWithProfiles);
        dispatch(saveTruckListings(matchedResponseWithProfiles));
        setLoading(false);
      }
    } catch (error) {
      console.log("fetchTruckListings error", error?.response);
      setLoading(false);
    }
  };

  const fetchTruckOwnerTrucksListings = async () => {
    setLoading(true);

    try {
      const truckListingResponse = await axiosInstance({
        url: "api/listing/all-truckowner-listing",
        method: "GET",
      });

      console.log("truckListingResponse", truckListingResponse?.data);

      if (truckListingResponse?.data) {
        const matchedResponses = truckListingResponse?.data;

        const matchedResponseWithProfiles = await Promise.all(
          matchedResponses?.map(async (listing) => {
            const matchedDriverProfile = await getDriversProfile(
              listing?.driverId
            );
            return { ...listing, matchedDriverProfile };
          })
        );

        console.log(
          "fetchTruckOwnerTrucksListings",
          matchedResponseWithProfiles
        );
        dispatch(saveTruckOnwerTrucksListings(matchedResponseWithProfiles));
        setLoading(false);
      }
    } catch (error) {
      console.log("fetchTruckOwnerTrucksListings error", error?.response);
      setLoading(false);
    }
  };

  const getDriversProfile = async (driverId) => {
    try {
      const response = await axiosInstance({
        url: `api/profile/driverprofiles/${driverId}`,
        method: "GET",
      });
      console.log("getDriversProfile res", response?.data);
      return response?.data;
    } catch (error) {
      console.error(
        `getDriversProfile error for driverId ${driverId}:`,
        error?.response
      );

      return null;
    }
  };

  const fetchDriversListings = async () => {
    setLoading(true);
    try {
      await axiosInstance({
        url: "api/profile/all-driverprofile",
        method: "GET",
      })
        .then((res) => {
          console.log("fetchDriversListings res", res?.data);
          setLoading(false);

          setDriverslisting(res?.data?.data);
        })
        .catch((err) => {
          console.log("fetchDriversListings err", err?.response?.data);
          setLoading(false);
        });
    } catch (error) {
      console.log("fetchDriversListings error", error);
      setLoading(false);
    }
  };

  const fetchDriversListingsWithTruckInfo = async () => {
    setLoading(true);
    try {
      const [driversRes, trucksRes] = await Promise.all([
        axiosInstance.get("api/profile/all-driverprofile"),
        axiosInstance.get("api/listings/all-offerings"),
      ]);

      const drivers = driversRes?.data?.data || [];
      const trucks = trucksRes?.data?.data || [];
      console.log("fetchDriversListingsWithTruckInfo", drivers, trucks);

      // Build a map of driverId -> truck info
      const driverToTruckMap = {};
      trucks?.forEach((truck) => {
        if (truck?.driverId) {
          driverToTruckMap[truck.driverId] = truck;
        }
      });

      // Append assigned truck info to each driver
      const enrichedDrivers = drivers?.map((driver) => ({
        ...driver,
        assignedTruck: driverToTruckMap[driver.driverId] || null,
      }));

      setDriverslisting(enrichedDrivers);
      setLoading(false);

      console.log("Enriched Drivers with Truck Info", enrichedDrivers);
    } catch (error) {
      console.log("Error fetching drivers or truck listings:", error);
      setLoading(false);
    }
  };

  const fetchTruckOwnersDriversListingsWithTruckInfo = async () => {
    setLoading(true);
    try {
      const [driversRes, trucksRes] = await Promise.all([
        axiosInstance.get("api/truckowner/get-drivers"),
        axiosInstance.get("api/listings/all-offerings"),
      ]);

      const drivers = driversRes?.data?.data || [];
      const trucks = trucksRes?.data?.data || [];
      console.log(
        "fetchTruckOwnersDriversListingsWithTruckInfo",
        drivers,
        trucks
      );

      // Build a map of driverId -> truck info
      const driverToTruckMap = {};
      trucks?.forEach((truck) => {
        if (truck?.driverId) {
          driverToTruckMap[truck?.driverId] = truck;
        }
      });

      // Append assigned truck info to each driver
      const enrichedDrivers = drivers?.map((driver) => ({
        ...driver,
        assignedTruck: driverToTruckMap[driver?.driverId] || null,
      }));

      setTruckOwnerDrivers(enrichedDrivers);
      setLoading(false);

      console.log(
        "Enriched TruckOwner Drivers with Truck Info",
        enrichedDrivers
      );
    } catch (error) {
      console.log("Error fetching drivers or truck listings:", error);
      setLoading(false);
    }
  };

  const fetchTruckOwnerDrivers = async () => {
    setLoading(true);
    try {
      await axiosInstance({
        url: "api/truckowner/get-drivers",
        method: "GET",
      })
        .then((res) => {
          console.log("fetchTruckOwnerDrivers res", res?.data);
          setLoading(false);

          setTruckOwnerDrivers(res?.data?.data);
        })
        .catch((err) => {
          console.log("fetchTruckOwnerDrivers err", err?.response?.data);
          setLoading(false);
        });
    } catch (error) {
      console.log("fetchTruckOwnerDrivers error", error);
      setLoading(false);
    }
  };

  const checkAndUpdateTruckOwnerDriversWithTruckListings = async () => {
    try {
      const res = await axiosInstance.get("api/listings/all-offerings");

      const assignedDrivers = res?.data?.data
        ?.filter((truck) => truck?.driverId)
        ?.map((truck) => truck?.driverId);

      console.log(
        "checkAndUpdateTruckOwnerDriversWithTruckListings",
        assignedDrivers,
        res?.data?.data
      );

      // Return unique driver IDs
      return Array.from(new Set(assignedDrivers));
    } catch (error) {
      console.error("Assigned driver fetch failed:", error?.response);
      return [];
    }
  };

  const employDriverToTruckOwner = async () => {
    console.log("employDriverToTruckOwner", selectedDriver);
    setLoading(true);

    const assignData = {
      driverId: selectedDriver?.driverId,
      status: "active",
      startDate: Date.now(),
      endDate: null,
      notes: "",
    };
    console.log("employDriverToTruckOwner", assignData);

    try {
      await axiosInstance({
        url: "api/truckowner/employ",
        method: "POST",
        data: assignData,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("employDriverToTruckOwner res", res?.data);
          setLoading(false);
          // setShowDrivers(false);
          setOpenModal(false);
          setTermsAccepted(false);

          toast.success(
            `Successfully employed ${selectedDriver?.fullName} to your organization`
          );

          fetchTruckOwnerTrucksListings();
          fetchTruckOwnersDriversListingsWithTruckInfo();
          fetchDriversListingsWithTruckInfo();
        })
        .catch((err) => {
          console.log("employDriverToTruckOwner err", err?.response?.data);
          setLoading(false);
          toast.error(
            `An error occured while employing ${selectedDriver?.fullName} to your organization`
          );
        });
    } catch (error) {
      console.log("employDriverToTruckOwner error", error?.response);
      setLoading(false);
      toast.error(
        `An error occured while employing ${selectedDriver?.fullName} to your organization`
      );
    }
  };

  const assignDriverToTruckOwnersTruck = async () => {
    console.log("assignDriverToTruckOwnersTruck");

    setLoading(true);

    const assignData = {
      driverId: selectedDriver?.driverId,
      truckId: selectedTruckForAssignment?.id,
      status: "assign",
      startDate: Date.now(),
      endDate: null,
    };

    try {
      await axiosInstance({
        url: "api/truckowner/assign-truck",
        method: "POST",
        data: assignData,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("handleAssignDriverToTruck res", res?.data);
          setLoading(false);
          setOpenModal(false);
          setTermsAccepted(false);

          toast.success(
            `Successfully assigned ${selectedDriver?.fullName} to ${selectedTruckForAssignment?.car_name}`
          );

          fetchTruckOwnerTrucksListings();
          fetchTruckOwnersDriversListingsWithTruckInfo();
          fetchDriversListingsWithTruckInfo();
        })
        .catch((err) => {
          console.log("handleAssignDriverToTruck err", err?.response?.data);
          setLoading(false);
          toast.error("An error occured while assigning driver to truck");
        });
    } catch (error) {
      console.log("handleAssignDriverToTruck error", error?.response);
      setLoading(false);
      toast.error("An error occured while assigning driver to truck");
    }
  };

  useEffect(() => {
    fetchTruckOwnerTrucksListings();
  }, []);

  useEffect(() => {
    // fetchDriversListings();
    fetchTruckOwnersDriversListingsWithTruckInfo();
    fetchDriversListingsWithTruckInfo();
    checkAndUpdateTruckOwnerDriversWithTruckListings().then((assigned) =>
      setAssignedDriverIds(assigned)
    );
  }, [showDrivers]);

  return (
    <Container>
      <div className="flex justify-between items-center 500 p-4">
        <h1 className="text-2xl font-bold text-gray-900">TruckListings</h1>
        <FormButton
          title={"Create Truck"}
          width={"100%"}
          onClick={() => {
            navigate("/add-truck");
          }}
        />
      </div>

      {showDrivers && selectedTruckForAssignment && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Assign Driver to: {selectedTruckForAssignment?.car_name}
          </h2>

          {loading ? (
            <p>Please wait while we aggregate the drivers list</p>
          ) : (
            <DriverSelectionDisplay
              driversArray={driversListing}
              truckOwnerDriversArray={truckOwnerDrivers}
              assignedDriverIds={assignedDriverIds}
              onDriverSelected={(driver) => {
                console.log("Selected Driver in Parent:", driver);
                setSelectedDriver(driver);
                setOpenModal(true);
              }}
              onCloseDisplay={() => {
                setShowDrivers(false);
              }}
            />
          )}

          {openModal && (
            <Modal
              title={
                selectedDriver?.truckownerId
                  ? "Truck Assignment"
                  : "Driver Employment"
              }
              isOpen={openModal}
              onClose={closeModal}
            >
              <div className="mt-4">
                {selectedDriver?.truckownerId ? (
                  <p className="text-lg text-center mb-3">
                    Are you sure you want to assign{" "}
                    <span className="font-semibold">
                      {selectedDriver?.fullName}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                      {selectedTruckForAssignment?.car_name}
                    </span>
                    ?
                  </p>
                ) : (
                  <p className="text-lg text-center mb-3">
                    Are you sure you want to employ{" "}
                    <span className="font-semibold">
                      {selectedDriver?.fullName}
                    </span>{" "}
                    to your organization as one of your drivers? Please read and
                    accept the{" "}
                    <span className="font-semibold">Terms & Conditions</span>{" "}
                    before proceeding with this.
                  </p>
                )}

                {/* Terms & Conditions Section */}
                <div className="text-sm text-gray-600 flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label htmlFor="terms">
                    I have read and accept the{" "}
                    <a
                      href="/terms-and-conditions"
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Terms & Conditions
                    </a>{" "}
                    regarding this employment or assignment.
                  </label>
                </div>

                <FormButton
                  title={
                    selectedDriver?.truckownerId
                      ? "Confirm Assignment"
                      : "Confirm Employment"
                  }
                  onClick={() => {
                    selectedDriver?.truckownerId
                      ? assignDriverToTruckOwnersTruck(selectedDriver)
                      : employDriverToTruckOwner(selectedDriver);
                  }}
                  loading={loading}
                  disabled={!termsAccepted}
                />
              </div>
            </Modal>
          )}
        </div>
      )}

      <TruckListingTable
        bookings={reduxTruckOwnersTrucksListings}
        tableTitle={"Truck listings"}
        assignDriver={(truck) => {
          setSelectedTruckForAssignment(truck);
          setShowDrivers(true);
        }}
      />
    </Container>
  );
}

export default TruckListings;
