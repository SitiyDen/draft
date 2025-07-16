import React, { useState, useEffect } from "react";

const useGoogleSheetData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const apiKey = "AIzaSyCNbP_V9dSJzxX-UdjS-0SuRdhBIVC_HFI";
      const sheetId = "1tHZdAG6FOlE03Dms1qg5SV1ygBQ3xwaCFkH9b__GB9Y"; 
      const sheetName = "Лист1";  
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.values) {
          const [headers, ...rows] = result.values;
          const parsedData = rows.map(row =>
            headers.reduce((acc, header, index) => {
              acc[header] = row[index] || "";
              return acc;
            }, {})
          );
           const filteredData = parsedData.filter(item => item.captain === "1");
          setData(filteredData);
        } else {
          setError("No data found");
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  {console.log('data:', data)}
  console.log('тип:', typeof data)
  return { data, loading, error };
};

const GoogleSheetData = ({ sheetId, apiKey, sheetName }) => {
  const { data, loading, error } = useGoogleSheetData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
};

export { GoogleSheetData, useGoogleSheetData };