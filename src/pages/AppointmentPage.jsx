import { useEffect, useState } from "react";
import {
  getConstituencies,
  getBooths,
  getCenters,
  getSlotTypes,
  getSlots,
  getHolidays,
  getZones,
  getDistricts,
  getFamilyBookings,
  getBlocks,
  getTowns,
} from "../services/api";

import TabsContainer from "../components/tabs/TabsContainer";
import ConstituencyTab from "../components/tabs/ConstituencyTab";
import BoothTab from "../components/tabs/BoothTab";
import CenterTab from "../components/tabs/CenterTab";
import SlotTypeTab from "../components/tabs/SlotTypeTab";
import HolidayTab from "../components/tabs/HolidayTab";
import ZoneTab from "../components/tabs/ZoneTab";
import FamilyBookingTab from "../components/tabs/FamilyBookingTab";
import DistrictTab from "../components/tabs/DistrictTab";
import BlockTab from "../components/tabs/BlockTab";
import TownTab from "../components/tabs/TownTab";
import ReportTab from "../components/tabs/ReportTab";

export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState("report");
  const [isLoading, setIsLoading] = useState(true);

  // MASTER DATA
  const [zones, setZones] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [towns, setTowns] = useState([]);
  const [booths, setBooths] = useState([]);
  const [centers, setCenters] = useState([]);
  const [slotTypes, setSlotTypes] = useState([]);
  const [slotTimes, setSlotTimes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [familyBookings, setFamilyBookings] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        zoneRes,
        districtRes,
        constituencyRes,
        blockRes,
        townRes,
        boothRes,
        centerRes,
        slotTypeRes,
        slotRes,
        holidayRes,
        familyBookingRes,
      ] = await Promise.all([
        getZones(),             // 1
        getDistricts(),          // 2
        getConstituencies(),     // 3
        getBlocks(),             // 4
        getTowns(),              // 5
        getBooths(),             // 6
        getCenters(),            // 7
        getSlotTypes(),           // 8
        getSlots(),               // 9
        getHolidays(),            // 10
        getFamilyBookings(),      // 11
      ]);

      setZones(zoneRes.data || []);
      setDistricts(districtRes.data || []);
      setConstituencies(constituencyRes.data || []);
      setBlocks(blockRes.data || []);
      setTowns(townRes.data || []);
      setBooths(boothRes.data || []);
      setCenters(centerRes.data || []);
      setSlotTypes(slotTypeRes.data || []);
      setSlotTimes(slotRes.data || []);
      setHolidays(holidayRes.data || []);
      setFamilyBookings(familyBookingRes.data || []);
    } catch (err) {
      console.error("Failed to load master data", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      {isLoading ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f8f9fa"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{
            marginTop: "25px",
            fontSize: "18px",
            color: "#666",
            fontWeight: "500"
          }}>
            Loading application...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <>
          <TabsContainer activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content">
        {activeTab === "zone" && (
          <ZoneTab rows={zones} setRows={setZones} />
        )}

        {activeTab === "district" && (
          <DistrictTab
            zones={zones}
            districts={districts}
            setDistricts={setDistricts}
          />
        )}

        {activeTab === "constituency" && (
          <ConstituencyTab
            zones={zones}
            districts={districts}
            rows={constituencies}
            setRows={setConstituencies}
          />
        )}

        {activeTab === "block" && (
          <BlockTab
            constituencies={constituencies}
            rows={blocks}
            setRows={setBlocks}
          />
        )}

        {activeTab === "town" && (
          <TownTab
            constituencies={constituencies}
            blocks={blocks}
            rows={towns}
            setRows={setTowns}
          />
        )}

        {activeTab === "booth" && (
          <BoothTab
            constituencies={constituencies}
            rows={booths}
            setRows={setBooths}
          />
        )}

        {activeTab === "center" && (
          <CenterTab
            constituencies={constituencies}
            booths={booths}
            rows={centers}
            setRows={setCenters}
          />
        )}

        {activeTab === "slot" && (
          <SlotTypeTab
            centers={centers}
            slotTypes={slotTypes}
            setSlotTypes={setSlotTypes}
            slotTimes={slotTimes}
            setSlotTimes={setSlotTimes}
          />
        )}

        {activeTab === "holiday" && (
          <HolidayTab
            booths={booths}
            centers={centers}
            slotTimes={slotTimes}
            rows={holidays}
            setRows={setHolidays}
          />
        )}

        {activeTab === "report" && <ReportTab />}
      </div>
        </>
      )}
    </div>
  );
}
