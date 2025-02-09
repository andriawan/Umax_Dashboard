import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ContainerCard from '../components/ContainerCard';
import { BiRefresh } from 'react-icons/bi';
import CardInfo from '../components/CardInfo';
import Chart from '../components/Chart';
import Card from '../components/Card';
import CardLoad from '../components/CardLoad';
import Setting from '../components/Setting';
import Metrics from '../components/Metrics';
import History from '../components/History';
import { FiAlertTriangle } from 'react-icons/fi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { google, meta, tiktok, } from "../assets";
import '../styles.css';
import { setActiveItem, updateSelectedName } from '../components/Sidebar'
import { useLanguage } from '../LanguageContext'; // Import the useLanguage hook
import Translation from '../translation/Translation.json'; 



import axios from 'axios';



const Dashboard = () => {

  const [metricsData, setMetricsData] = useState([]);
  const [activeTab, setActiveTab] = useState('performance');
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const { selectedLanguage } = useLanguage(); // Get selectedLanguage from context
  const translations = Translation[selectedLanguage];
  const [data, setData] = useState([]);
  const [barr, setBarr] = useState([]);

  const [metrics, setMetrics] = useState([]);
  const [metric_id, setMetricId] = useState(''); // Inisialisasi dengan nilai default jika diperlukan.
  // const [selectedData, setSelectedData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("lastweek"); // Set ke string kosong
  const [chartUrl, setChartUrl] = useState('');
  const [suggestionData, setSuggestionData] = useState([]);

    const fetchSuggestions = async () => {
      const id = metric_id;
      console.log("ID CAMPAIGN",id)
      try {
        const response = await axios.get(`https://umaxdashboard-1-w0775359.deta.app/suggestion/${id}`);
        if (response.status === 200) {
          const data = response.data;
          setSuggestionData(data);
        } else {
          console.error('Failed to fetch suggestion data from API');
        }
      } catch (error) {
        console.error('An error occurred while fetching suggestion data', error);
      }
    };
    useEffect(() => {
      // Fetch metrics data and set it in the state
      fetchSuggestions();
    }, []);

  useEffect(() => {
    // Fetch metrics data and set it in the state
    fetchMetricsData();
  }, []);

  const fetchMetricsData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const apiUrl = "https://umaxdashboard-1-w0775359.deta.app/metrics";
  
      const response = await fetch(apiUrl, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        
        // Ambil metric_id dari data (misalnya, dari item pertama).
        const metricIdFromData = data.length > 0 ? data[0]._id : '';
        
        // Set metric_id ke dalam state.
        setMetricId(metricIdFromData);
      } else {
        console.error('Gagal mengambil data metrics');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };
  const updateChartUrl = (timeframe) => {
    if (selectedName && metric_id) {
      const baseUrl = 'https://umaxdashboard-1-w0775359.deta.app/'; // URL dasar
      const selectedTimeframe = timeframe === 'lastweek' ? 'lastweek' : timeframe === 'lastmonth' ? 'lastmonth' : 'lastyear';
      // Ganti ini sesuai kebutuhan
      const newUrl = `${baseUrl}${selectedTimeframe}/${metric_id}`;
      setChartUrl(newUrl);
      console.log(newUrl)
    }
  };
  

  const fetchHistoryData = async (metric_id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const apiUrl = `https://umaxdashboard-1-w0775359.deta.app/history/${metric_id}`; // Updated URL with metric_id
  
      const response = await fetch(apiUrl, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        // Handle non-OK status here
        const errorData = await response.json();
        setError(errorData.detail);
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      setError('Terjadi kesalahan dalam mengambil data.');
    }
  };

  useEffect(() => {
    if (metric_id) {
      updateChartUrl(selectedTimeframe);
    } else {
      setSelectedData(null);
    }
  }, [metric_id]);


  const handleItemClick = (item) => {
    setSelectedTimeframe("lastweek");
    setActiveItem(item.campaign_name);
    setSelectedName(item.campaign_name);
    setSuggestionData(suggestionData);
    setSelectedData(item);
    updateChartUrl(selectedTimeframe);
  };

  const updateSelectedName = (item) => {
    setSelectedName(item);
    console.log("Selected Name:", item);
  };

  const fetchCampaignData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://umaxdashboard-1-w0775359.deta.app/metrics', {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error('Gagal mengambil data');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('https://umax-1-z7228928.deta.app/metrics/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setMetricsData(data);
        } else {
          console.error('Failed to fetch data from API');
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
    };

    fetchData();
  }, []);


 

  const [state, setState] = useState({
    toggleNavbar: false,
  });

  const toggleSidebar = () => {
    setState({ ...state, toggleNavbar: !state.toggleNavbar });
  };

  const contentStyles = {
    marginLeft: state.toggleNavbar ? '72px' : '0',
  };


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  // data metrics
  const metricsChart = async () => {
    try {
      const id = metric_id;
      // console.log("ID METRICS",id) 
      const token = localStorage.getItem('jwtToken');  
      const apiUrl = `https://umaxdashboard-1-w0775359.deta.app/lastweek/6549a4196a890c59d1ced723`;
  
      const response = await fetch(apiUrl, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const barr = await response.json();
        setBarr(barr);
        
        // Ambil metric_id dari data (misalnya, dari item pertama).
        const metricIdFromData = barr.length > 0 ? barr[0]._id : '';
        
        // Set metric_id ke dalam state.
        setMetricId(metricIdFromData);
      } else {
        console.error('Gagal mengambil metrics');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };
  useEffect(() => {
    metricsChart();
  }, []);


  //Data Baru
  //Backend tinggal ikutin ini aja

  const metrixDatas = [
    {
      title: translations["Amount Spent"],
      value: selectedData
        ? selectedData.amountspent
        : barr.map((dayData) => dayData.amountspent), // Ambil semua amountspent dari barr
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.amountspent.replace(/\D/g, '')),
      })),
      persen: 2.0,
      description: "Total Amount spent compared to last 7 day",
      descModal: "Jumlah total biaya yang kita keluarkan untuk pemasangan iklan",
    },
    {
      title: translations["Reach"],
      value: selectedData
        ? selectedData.reach
        : barr.map((dayData) => dayData.reach), // Ambil semua reach dari barr
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.reach.replace(/\D/g, '')),
      })),
      persen: 2.0,
      description: "Total Amount spent compared to last 7 day",
      descModal: "Jumlah total biaya yang kita keluarkan untuk pemasangan iklan",
    },
    {
      title: translations["Impression"],
      value: selectedData ? selectedData.impressions : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: -2.0,
      description: "Total Impression compared to last 7 day",
      descModal:
        "Jumlah iklan kita ditayangkan. Bedanya dengan Reach, user yang sama bisa dihitung melihat iklan yang sama lebih dari satu kali",
    },
    {
      title: translations["Frequency"],
      value: selectedData ? selectedData.frequency : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 20 },
        { name: "Day5", value: 10 },
        { name: "Day6", value: 15 },
        { name: "Day7", value: 5 },
      ],
      persen: -2.0,
      description: "Total Impression compared to last 7 day",
      descModal:
        "Berapa kali rata-rata seorang user melihat iklan kita ditampilkan dalam rentang waktu tertentu. Dihitung dari jumlah Impressions dibagi dengan jumlah Reach",
    },
    {
      title: translations["Reach Amount Spent Ratio"],
      value: selectedData ? selectedData.rar : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 20 },
        { name: "Day5", value: 10 },
        { name: "Day6", value: 15 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Reach Amount Spent ratio compared to last 7 day",
      descModal:
        "Mengukur hubungan antara jumlah orang yang melihat iklan dengan jumlah uang yang dihabiskan untuk iklan tersebut",
    },
    {
      title: translations["Cost Per Click"],
      value: selectedData ? selectedData.cpc : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Cost per Click compared to last 7 day",
      descModal:
        "Perhitungan biaya yang kita keluarkan untuk setiap Link Clicks. Dihitung dari jumlah Amount Spent dibagi dengan jumlah Link Clicks",
    },
    {
      title: translations["Click Through Rate"],
      value: selectedData ? selectedData.ctr : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 15 },
      ],
      persen: 2.0,
      description: "Total Click Through Rate compared to last 7 day",
      descModal:
        "Rasio jumlah klik pada iklan kita dibandingkan dengan jumlah iklan ditayangkan. Dihitung dari jumlah Link Click dibagi dengan jumlah Impressions",
    },
    {
      title: translations["Outbont Click Landing Page"],
      value: selectedData ? selectedData.oclp : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 5 },
      ],
      persen: -2.0,
      description: "Total OCLP compared to last 7 day",
      descModal:
        "Mendorong pengunjung untuk mengklik tautan atau tombol yang mengarahkan mereka ke halaman atau situs web eksternal yang relevan",
    },
    {
      title: translations["Cost Per Result"],
      value: selectedData ? selectedData.cpr : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Cost per Result compared to last 7 day",
      descModal:
        "Perhitungan biaya yang kita keluarkan untuk setiap hasil yang kita dapatkan",
    },
    {
      title: translations["Add To Cart"],
      value: selectedData ? selectedData.atc : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Add to Cart compared to last 7 day",
      descModal:
        "Menambahkan produk atau barang ke dalam keranjang belanja saat berbelanja secara online di situs web e-commerce atau toko online",
    },
    {
      title: translations["Return on Ad Spent"],
      value: selectedData ? selectedData.roas : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total ROAS to last 7 day",
      descModal:
        "Mengukur seberapa banyak pendapatan atau hasil yang dihasilkan dari setiap unit pengeluaran iklan",
    },
    {
      title: translations["Real ROAS"],
      value: selectedData ? selectedData.realroas : null,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Real ROAS to last 7 day",
      descModal:
        "Mengukur banyak pendapatan asli yang di hasilkan tiap pengeluaran iklan",
    },
  ];

  //ubah integer dari BE ke rupiah
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  //ubah nilai float dari BE ke 1 angka dibelakang koma
  const formattedKoma1 = (number) =>
    number.toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  //ubah nilai float dari BE ke format indonesia
  const formattedNumber = (number) =>
    number.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  //prettier-ignore
  //format value metrix
  const formatValueMetrix = (metrixData) => {
    const formatMap = {
      "Amount Spent": (value) => `${formattedNumber(value)}`,
      "Cost per Click": (value) => `${formattedNumber(value)}`,
      "Cost per Result": (value) => `${formattedNumber(value)}`,
      "Reach": (value) => `${formattedNumber(value)} `,
      "Impression": (value) => `${formattedNumber(value)} `,
      "Frequency": (value) => `${formattedKoma1(value)}`,
      "Return on ADD Spent": (value) => `${formattedKoma1(value)}`,
      "Real ROAS": (value) => `${formattedKoma1(value)}`,
      "Reach Amount Spent Ratio": (value) => `${formattedKoma1(value)} `,
      "Outbont Click Landing Page": (value) => `${formattedKoma1(value)} `,
      "Click Through Rate": (value) => `${formattedKoma1(value)} `,
      "Add to Cart": (value) => `${formattedKoma1(value)} `,
    };

    const formatFunction = formatMap[metrixData.title];

    if (formatFunction) {
      return formatFunction(metrixData.value);
    }

    return metrixData.value;
  };

  //prettier-ignore
  //format style description
  const formatDescMetrix = (metrixData) => {
    const formatMap = {
      "Amount Spent": 
      (description) => (
        <p
          style={{
            fontSize: "10.5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
      "Frequency": (description) => (
        <p
          style={{
            fontSize: "11px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
      "Reach Amount Spent Ratio": 
      (description) => (
        <p
          style={{
            fontSize: "9.5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
      "Cost per Click":
       (description) => (
        <p
          style={{
            fontSize: "10.4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
      "Click Through Rate": 
      (description) => (
        <p
          style={{
            fontSize: "9.5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
      "Outbont Click Landing Page": (description) => (
        <p
          style={{
            fontSize: "11.5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
      "Cost per Result": (description) => (
        <p
          style={{
            fontSize: "10.1px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
    };

    const formatFunction = formatMap[metrixData.title];

    if (formatFunction) {
      return formatFunction(metrixData.description);
    }

    return metrixData.description;
  };
  const handleTimeframeChange = (event) => {
    const selectedTimeframe = event.target.value;
    setSelectedTimeframe(selectedTimeframe);
    updateChartUrl(selectedTimeframe); // Panggil fungsi ini untuk mengubah URL
  };
  

  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div >
            {/* bagian filter */}
            <div className='flex justify-end'>
              <div className='flex gap-5 items-center'>
                <div className='flex gap-2 text-gray-500'>
                  <BiRefresh size={25} />
                  Feb 4, 20:12
                </div>
               <select
                  name=""
                  id=""
                  className='focus:outline-none p-2 px-5 border border-gray-300 text-gray-500 rounded-md'
                  onChange={handleTimeframeChange}
                  value={selectedTimeframe}
                >
                  <option hidden value="">Filter Data</option>
                  <option value="lastweek">{translations['Last Week']}</option>
                  <option value="lastmonth">{translations['Last Month']}</option>
                  <option value="lastyear">{translations['Last Year']}</option>
                </select>
              </div>
            </div>
            {/* end */}

            {/* bagian content */}
            <div>
              <div className='flex flex-col md:flex-row mt-5 md:gap-5'>
                {/* Card Info */}

                {selectedData && (
                  <div className="md:w-8/12 w-full flex flex-col h-full gap-5">
                    <CardInfo
                      title={translations['Amount Spent']}
                      value={selectedData.amountspent}
                      color="text-sky-500"
                      popupContent="Jumlah total biaya yang kita keluarkan untuk pemasangan iklan"
                      />
                    <CardInfo
                      title={translations['Reach Amount Spent Ratio']} 
                      value={selectedData.rar}
                      color="text-yellow-500"
                      popupContent="Mengukur hubungan antara jumlah orang yang melihat iklan dengan jumlah uang yang dihabiskan untuk iklan tersebut"
                    />
                    <CardInfo
                      title={translations['Click Through Rate']}
                      value={selectedData.ctr}
                      color='text-green-500'
                      popupContent='Rasio jumlah klik pada iklan kita dibandingkan dengan jumlah iklan ditayangkan'
                    />
                    <CardInfo
                      title='OCLP'
                      value={selectedData.oclp}
                      popupContent='Mendorong pengunjung untuk mengklik tautan atau tombol yang mengarahkan mereka ke halaman atau situs web eksternal yang relevan'
                    />
                  </div>
                )}

                {/* Chart */}
                <div className='flex flex-col w-full'>
                <div className='w-full mt-1 flex flex-col  gap-5 justify-between'>
                <Chart metricId={chartUrl} />
              </div>

                  {selectedData && (
              <div className="flex w-full flex-col md:flex-row gap-4 max-sm:w-full justify-center mx-auto -mt-[13px]">
                <div className="card-container ">
                  <CardInfo
                    title='CPR'
                    value={selectedData.cpr}
                    popupContent='Perhitungan biaya yang kita keluarkan untuk setiap hasil yang kita dapatkan'
                  />
                </div>
                <div className="card-container">
                  <CardInfo
                    title='ATC'
                    value={selectedData.atc}
                    popupContent='Menambahkan produk atau barang ke dalam keranjang belanja saat berbelanja secara online di situs web e-commerce atau toko online'
                  />
                </div>
                <div className="card-container">
                  <CardInfo
                    title='ROAS'
                    value={selectedData.roas}
                    popupContent='Mengukur seberapa banyak pendapatan atau hasil yang dihasilkan dari setiap unit pengeluaran iklan'
                  />
                </div>
                <div className="card-container">
                  <CardInfo
                    title='Real ROAS'
                    value={selectedData.realroas}
                    popupContent='Mengukur banyak pendapatan asli yang dihasilkan tiap pengeluaran iklan'
                  />
                </div>
              </div>
            )}

                  </div>
              </div>
            </div>
            {/* end */}


            {/* bagian sugesti */}
            <div>
              <div className='relative top-5 border-t-2 border-gray-600 p-5 px-10 pb-5'>
                <h1 className='text-xl font-bold text-gray-700'>{translations['Suggestion']}</h1>
                <div className='flex flex-col mt-5 md:flex-row gap-5 '>
              

                
                 <div id='warning' >
                  <Card color='yellow' >
                    <div className=' max-w-sm'>
                      <div className='flex gap-3'>
                        <div>
                          <FiAlertTriangle size={25} className='text-yellow-500' />
                        </div>
                        {suggestionData.length > 0 && (
                          <div>
                             {suggestionData.map((suggestion, index) => (
                               <div key={index}>
                               <h2>{suggestion.error3}</h2>
                               <p>{suggestion.message3}</p>
                             </div>
                             ))}
                          </div>
                        )}
                        {/* <div>
                          <div className='font-medium mb-2'>{translations['CTR Value']}</div>
                          <p>{translations['Message CTR']}</p>
                        </div> */}
                      </div>
                      <a href="https://chat.openai.com/share/3bb35f6a-4b3b-4182-b6f9-c880722b3c72" target="_blank" rel="noopener noreferrer">
                        <div className='mt-2 hover:underline  text-end text-sm'>
                        {translations['Learn More']}
                        </div>
                      </a>
                    </div>
                  </Card>
                  </div>
                 
                  <Card color='red'>
                    <div className='max-w-sm'>
                      <div className='flex gap-3'>
                        <div>
                          <AiOutlineCloseCircle size={25} className='text-red-500' />
                        </div>
                        {suggestionData.length > 0 && (
                          <div>
                             {suggestionData.map((suggestion, index) => (
                               <div key={index}>
                               <h2>{suggestion.error4}</h2>
                               <p>{suggestion.message4}</p>
                             </div>
                             ))}
                          </div>
                        )}
                      </div>
                      <a href="https://chat.openai.com/share/cb290ced-08a9-4153-93dc-470a1e0fd126" target="_blank" rel="noopener noreferrer">
                        <div className='mt-2 hover:underline  text-end text-sm'>
                        {translations['Learn More']}
                        </div>
                      </a>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
            {/* end */}
          </div>
        );
      case 'metrics':
        return (
          <div>
            {/* bagian filter */}
            <div className='flex justify-end'>
              <div className='flex gap-5 items-center'>
                <div className='flex gap-2 text-gray-500'>
                  <BiRefresh size={25} />
                  Feb 4, 20:12
                </div>
              </div>
            </div>
            {/* end */}

            {/* bagian content */}
            <div className="flex flex-wrap justify-center gap-4 px-2 md:gap-8 max-sm:flex-col">
              {selectedData ? (
                metrixDatas.map((metrixData, index) => (
                  <Metrics
                    key={index}
                    title={metrixData.title}
                    value={formatValueMetrix(metrixData)}
                    chartData={metrixData.chart}
                    icon={<AiOutlineInfoCircle size={20} />}
                    persen={`${formattedKoma1(metrixData.persen)}%`}
                    description={formatDescMetrix(metrixData)}
                    persenTextColor={metrixData.persen < 0 ? "#ffff" : "#ffff"}
                    spanBackgroundColor={metrixData.persen < 0 ? "#EF4444" : "#22C55E"}
                    descModal={metrixData.descModal}
                  />
                ))
              ) : (
                <CardLoad/>
            )}
            </div>
          </div>
        );

      case 'history':
        return (
          <div>
          {metric_id ? (
            <History metric_id={metric_id} />
          ) : (
            <p>Select a valid item</p>
          )}
        </div>
        );
      case 'setting':
        return (


          <Setting />

        );
      default:
        return null;
    }
  };

 
  const cardData = [
    {
      title: 'Amount Spent',
      value: 'Rp. 4.000.000',
      color: 'text-sky-500',
      popupContent: 'Jumlah total biaya yang kita keluarkan untuk pemasangan iklan' 
    },
    {
      title: 'Reach Amount Spent Ratio',
      value: '6.1%',
      color: 'text-yellow-500',
      popupContent: 'Mengukur hubungan antara jumlah orang yang melihat iklan dengan jumlah uang yang dihabiskan untuk iklan tersebut' 
    },
    {
      title: 'Click Through Rate',
      value: '1.0%',
      color: 'text-green-500',
      popupContent: 'Rasio jumlah klik pada iklan kita dibandingkan dengan jumlah iklan ditayangkan' 
    },
    {
      title: 'OCLP',
      value: '30%',
      popupContent: 'Mendorong pengunjung untuk mengklik tautan atau tombol yang mengarahkan mereka ke halaman atau situs web eksternal yang relevan' 
    }
  ];

  
  const cardData2 = [
    {
      title: 'CPR',
      value: 'Rp. 5.000',
      popupContent: ' Perhitungan biaya yang kita keluarkan untuk setiap hasil yang kita dapatkan' 
    },
    {
      title: 'ATC',
      value: '2,5%',
      popupContent: ' Menambahkan produk atau barang ke dalam keranjang belanja saat berbelanja secara online di situs web e-commerce atau toko online' 
    },
    {
      title: 'ROAS',
      value: '1.0%',
      popupContent: 'Mengukur seberapa banyak pendapatan atau hasil yang dihasilkan dari setiap unit pengeluaran iklan' 
    },
    {
      title: 'Real ROAS',
      value: '1.0%',
      popupContent: 'Mengukur banyak pendapatan asli yang di hasilkan tiap pengeluaran iklan' 
    },
  ];


 
  const renderCardInfo = () => {
    return cardData.map((item, index) => {
      return <CardInfo key={index} title={item.title} value={item.value} color={item.color} className='relative w-full flex top-5 flex-col justify-between h-24'          
      popupContent={item.popupContent}
      />
    })
  }

  const renderCardInfo2 = () => {
    return cardData2.map((item, index) => {
      return <CardInfo  key={index} title={item.title} value={item.value} color={item.color} className='w-full flex flex-col justify-between h-24' 
      popupContent={item.popupContent} 
      />
    })
  }

   useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('https://umaxdashboard-1-w0775359.deta.app/metricslastweek/6549a4196a890c59d1ced723',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
        );
        if (response.status === 200) {
          const data = response.data;
          console.log(data); 
          setMetricsData(data);
        } else {
          console.error('Failed to fetch data from API');
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
      
    };

    fetchData();
  }, []);
  

  
  
  return (
    <main className='bg-slate-100 min-h-screen ' >
      <div>
        <Navbar />
      </div>
      <div className='flex gap-5  px-5'>
      <Sidebar state={state} toggleSidebar={toggleSidebar} updateSelectedName={handleItemClick} setMetricId={setMetricId}/>

        <ContainerCard >

          {/* Header */}
          <div className='border-b-2  border-gray-600'>
          <div className='flex p-4 ml-3 pb-1 items-center'>
  {selectedData && (
    <img src={
      selectedData.campaign_platform === 1
        ? meta
        : selectedData.campaign_platform === 2
          ? google
          : selectedData.campaign_platform === 3
            ? tiktok
            : ''
    } alt="icon" width={30} />
  )}
    <h1 className={`text-2xl pl-3 font-bold ${
      selectedName ? 'text-gray-600' : 'left-10 bg-gray-200 top-3 w-44 h-5 animate-pulse rounded-md relative'
    }`}>
      {selectedName ? selectedName : (
        <h1 className="w-5 h-5 relative -left-12 rounded-md bg-gray-200">
        </h1>
      )}
    </h1>
</div>



            <div className="flex justify-center">
              <ul className=" flex -mb-1 flex-wrap  sm:flex-row">
                <li
                  className={`p-3 px-5 ${activeTab === 'performance' ? 'atas text-sky-500 cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                    }`}
                  onClick={() => handleTabClick('performance')}
                >
                  {translations['Performance']}
                </li>
                <li
                  className={`p-3 px-5 ${activeTab === 'metrics' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                    }`}
                  onClick={() => handleTabClick('metrics')}
                >
                  {translations['Metrics']}
                </li>
                <li
                  className={`p-3 px-5 ${activeTab === 'history' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                    }`}
                  onClick={() => handleTabClick('history')}
                >
                  {translations['History']}
                </li>
                <li
                  className={`p-3 px-5 ${activeTab === 'setting' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                    }`}
                  onClick={() => handleTabClick('setting')}
                >
                  {translations['Setting']}
                </li>
              </ul>
            </div>

          </div>
          {/* Body */}
          <div className='px-5 py-5 flex flex-col '>

            {/* pemanggil */}
            {renderContent()}
          </div>


        </ContainerCard>
      </div>


    </main>
  );

}

export default Dashboard