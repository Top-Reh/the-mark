import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import UploadProduct from '../ProductUpload';

const Admindashboard = () => {
    const [openTab,setOpenTab] = useState('Dashboard')
  return (
    <div className='admindashboard'>
        <div className='admindashboard__sidebar'>
            <ul>
                <li className={openTab === "Dashboard" ? "bg-gray-100" : "bg-white"} onClick={() => setOpenTab('Dashboard')}>
                <i className="bi bi-grid"></i>Dashboard
                </li>
                <li className={openTab === "Orders" ? "bg-gray-100" : "bg-white"} onClick={() => setOpenTab('Orders')}>
                <i className="bi bi-back"></i>Orders
                </li>
                <li className={openTab === "UploadProduct" ? "bg-gray-100" : "bg-white"} onClick={() => setOpenTab('UploadProduct')}>
                <i className="bi bi-bag-plus-fill"></i>New
                </li>
                <li className={openTab === "Products" ? "bg-gray-100" : "bg-white"} onClick={() => setOpenTab('Products')}>
                <i className="bi bi-box"></i>Products
                </li>
                <li className={openTab === "Payments" ? "bg-gray-100" : "bg-white"} onClick={() => setOpenTab('Payments')}>
                <i className="bi bi-currency-dollar"></i>Payments
                </li>
                <li className={openTab === "Customers" ? "bg-gray-100" : "bg-white"} onClick={() => setOpenTab('Customers')}>
                <i className="bi bi-people"></i>Customers
                </li>
                <li className={openTab === "Analytics" ? "bg-gray-100" : "bg-white"} onClick={() => setOpenTab('Analytics')}>
                <i className="bi bi-graph-up-arrow"></i>Analytics
                </li>
                <li className={openTab === "Settings" ? "bg-gray-100" : "bg-white"} onClick={() => setOpenTab('Settings')}>
                <i className="bi bi-gear"></i>Settings
                </li>
            </ul>
        </div>
        <div className='admindashboard__content'>
            {
                openTab === 'Dashboard' ? <Dashboard /> 
                : openTab === 'Products' ? <Products /> 
                : openTab === 'Orders' ? <Orders /> 
                : openTab === 'Customers' ? <Customers /> 
                : openTab === 'UploadProduct' ? <UploadProduct /> 
                : openTab === 'Analytics' ? <Analytics /> 
                : openTab === 'Payments' ? <Payments /> 
                :<Settings/>
            }
        </div>
    </div>
  )
}

const Dashboard = () => {
    return (
        <div className='dashboard'>
            <h1 className='admindashboard__header'>Admin Dashboard</h1>
            <div className='dashboard_header'>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-box-seam"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Total Sales</p>
                    <h1>$12,145</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-cart2"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Total Orders</p>
                    <h1>$12,145</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-reception-4"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Total Visition</p>
                    <h1>$24,234</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-bounding-box-circles"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Total Revenue</p>
                    <h1>$14,144</h1>
                </div>
            </div>
            <div className='dashboard_rate'>
                <div className='dashboard_lifetime_sales'>
                    <h1>Lifetime Sales</h1>
                </div>
                <div className='dashboard_geography'>
                    <h1>Geography</h1>
                </div>
            </div>
            <div className='dashboard_table'>
                <div className='dashboard_table_header'>
                    <h1>Top Selling Products</h1>
                    <div className='dashboard_table_buttons'>
                        <button ><i className="bi bi-funnel"></i>Filter</button>
                        <button >See All</button>
                    </div>
                </div>
                <div className='dashboard_products_table'>
                    <ul className='dashboard_products_table_header'>
                      <li><i className="bi bi-square"></i>Product Name<i className="bi bi-chevron-down"></i></li>  
                      <li>Price<i className="bi bi-chevron-down"></i></li>
                      <li>Category<i className="bi bi-chevron-down"></i></li>
                      <li>Quantity<i className="bi bi-chevron-down"></i></li>
                      <li>Amount<i className="bi bi-chevron-down"></i></li>
                      <li>Action</li>
                    </ul>
                    <ul className='dashboard_products'>
                        <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Shirt</li>  
                        <li>$12.00</li>
                        <li>Clothes</li>
                        <li>12</li>
                        <li>$120.00</li>
                        <li><i className="bi bi-three-dots-vertical"></i></li>
                    </ul>
                    <ul className='dashboard_products'>
                        <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Shirt</li>  
                        <li>$12.00</li>
                        <li>Clothes</li>
                        <li>12</li>
                        <li>$120.00</li>
                        <li><i className="bi bi-three-dots-vertical"></i></li>
                    </ul>
                    <ul className='dashboard_products'>
                        <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Shirt</li>  
                        <li>$12.00</li>
                        <li>Clothes</li>
                        <li>12</li>
                        <li>$120.00</li>
                        <li><i className="bi bi-three-dots-vertical"></i></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

const Products = () => {
    return (
        <div className='admin_products_container'>
            <div className='products_table_header'>
                <h1>Products</h1>
                <div className='admin_products_table_buttons'>
                    <button ><i className="bi bi-funnel"></i>Filter</button>
                    <button >See All</button>
                </div>
            </div>
            <div className='admin_products_table'>
                <ul className='admin_products_table_header'>
                    <li><i className="bi bi-square"></i>Product Name<i className="bi bi-chevron-down"></i></li>  
                    <li>Category</li>
                    <li>Price</li>
                    <li>Discount</li>
                    <li>Stock</li>
                    <li>Status</li>
                    <li>Action</li>
                </ul>
                <ul className='admin_products'>
                    <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Shirt</li>  
                    <li>Clothes</li>
                    <li>$12.00</li>
                    <li>10%</li>
                    <li>12</li>
                    <li><p className='text-blue-600 bg-blue-100'>Scheduled</p></li>
                    <li><i className="bi bi-three-dots-vertical"></i></li>
                </ul>
                <ul className='admin_products'>
                    <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Shirt</li>  
                    <li>Clothes</li>
                    <li>$12.00</li>
                    <li>10%</li>
                    <li>12</li>
                    <li ><p className='text-green-600 bg-green-100'>Active</p></li>
                    <li><i className="bi bi-three-dots-vertical"></i></li>
                </ul>
                <ul className='admin_products'>
                    <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Shirt</li>  
                    <li>Clothes</li>
                    <li>$12.00</li>
                    <li>10%</li>
                    <li>12</li>
                    <li><p className='text-yellow-600 bg-yellow-100'>Draft</p></li>
                    <li><i className="bi bi-three-dots-vertical"></i></li>
                </ul>
            </div>
        </div>
    )
}

const Orders = () => {
    const ordertabs = ['All orders', 'Complete', 'Pending', 'Cancel'];
    const [activeOrderTab, setActiveOrderTab] = useState('All orders');
    const handleDateFilter = (dateRange) => {
        console.log("Selected date filter:", dateRange);
        // Apply filter logic here based on `dateRange`
      };
    return (
        <div className='admin_orders_container'>
            <div className='orders_table_header'>
                <div>
                    <h1 className='text-xl font-bold'>Orders</h1>
                    <p className='text-xs text-gray-600'>15 Orders found</p>
                </div>
                <DateFilterDropdown onSelect={handleDateFilter}/>
            </div>
            <div className='admin_orders_table_buttons'>
            <ul className="flex gap-7 ">
                {ordertabs.map((tab) => (
                    <li
                    key={tab}
                    className={`relative pb-2 text-sm font-normal cursor-pointer transition-all duration-200 
                        ${activeOrderTab === tab ? 'text-blue-600 ' : 'text-gray-600'}
                    `}
                    onClick={() => setActiveOrderTab(tab)}
                    >
                    {tab}
                    {activeOrderTab === tab && (
                        <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-blue-600 rounded"></span>
                    )}
                    </li>
                ))}
                </ul>
            </div>
            <div className='admin_orders_table'>
                <ul className='admin_orders_table_header'>
                    <li>#</li>
                    <li>Order ID</li>  
                    <li>Product Name</li>
                    <li>Address</li>
                    <li>Date</li>
                    <li>Price</li>
                    <li>Status</li>
                </ul>
                <ul>
                    <li>1</li>
                    <li>#1234567</li>  
                    <li><img className='w-8 h-8 object-cover object-center rounded-sm' src='https://i.pinimg.com/474x/8c/2b/4b/8c2b4b428911a7b2a4560ddbf9b51e85.jpg' alt='shirt'></img>Shirt</li>
                    <li>351 Elgin St .Celina</li>
                    <li>4/21/2025</li>
                    <li>$34452</li>
                    <li><p  className='text-green-600 bg-green-100 p-2 px-3 rounded-3xl'>
                    Complete </p></li>
                </ul>
                <ul>
                    <li>2</li>
                    <li>#1234567</li>  
                    <li><img className='w-8 h-8 object-cover object-center rounded-sm' src='https://i.pinimg.com/474x/8c/2b/4b/8c2b4b428911a7b2a4560ddbf9b51e85.jpg' alt='shirt'></img>Shirt</li>
                    <li>351 Elgin St .Celina</li>
                    <li>4/21/2025</li>
                    <li>$34452</li>
                    <li><p  className='text-yellow-600 bg-yellow-100 p-2 px-3 rounded-3xl'>
                    Pending </p></li>
                </ul>
                <ul>
                    <li>3</li>
                    <li>#1234567</li>  
                    <li><img className='w-8 h-8 object-cover object-center rounded-sm' src='https://i.pinimg.com/474x/8c/2b/4b/8c2b4b428911a7b2a4560ddbf9b51e85.jpg' alt='shirt'></img>Shirt</li>
                    <li>351 Elgin St .Celina</li>
                    <li>4/21/2025</li>
                    <li>$34452</li>
                    <li><p  className='text-red-600 bg-red-100 p-2 px-3 rounded-3xl'>
                    Cancled </p></li>
                </ul>
            </div>
        </div>
    )
}


const dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last_7_days' },
    { label: 'Last 30 Days', value: 'last_30_days' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
  ];
  
  const DateFilterDropdown = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('Filter by Date');
  
    const handleSelect = (option) => {
      setSelectedLabel(option.label);
      setIsOpen(false);
      onSelect(option.value); // pass the selected date range to parent
    };
  
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
        >
          {selectedLabel}
          <ChevronDown className="w-4 h-4" />
        </button>
  
        {isOpen && (
          <div className="absolute z-10 top-0 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg flex flex-col ">
            {dateOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

const Customers = () => {
    return (
        <div className='admin_customers_container flex flex-col gap-5'>
            <div className='dashboard_header'>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-box-seam"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>accepted</p>
                    <h1>$12,145</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-cart2"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>pending</p>
                    <h1>$12,145</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-reception-4"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Cancel</p>
                    <h1>$24,234</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-bounding-box-circles"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Total orders</p>
                    <h1>$14,144</h1>
                </div>
            </div>
            <div className='dashboard_table'>
                <div className='dashboard_table_header'>
                    <h1>Customers</h1>
                    <div className='dashboard_table_buttons'>
                        <button ><i className="bi bi-funnel"></i>Filter</button>
                        <button >See All</button>
                    </div>
                </div>
                <div className='dashboard_products_table dashboard_customers_table'>
                    <ul className='dashboard_products_table_header
                    '>
                      <li><i className="bi bi-square"></i>Customers</li>  
                      <li>Status</li>
                      <li>Location</li>
                      <li>Orders</li>
                      <li>Total Amount</li>
                      <li>Action</li>
                    </ul>
                    <ul className='dashboard_products'>
                        <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Jame</li>  
                        <li><p  className='text-green-600 bg-green-100 p-2 px-3 rounded-3xl'>
                    Accepted </p></li>
                        <li>Mandalay,Myanmar</li>
                        <li>12 Orders</li>
                        <li>$120.00</li>
                        <li><i className="bi bi-three-dots-vertical"></i></li>
                    </ul>
                    <ul className='dashboard_products'>
                        <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Jame</li>  
                        <li><p  className='text-yellow-600 bg-yellow-100 p-2 px-3 rounded-3xl'>Pending </p></li>
                        <li>Mandalay,Myanmar</li>
                        <li>12 Orders</li>
                        <li>$120.00</li>
                        <li><i className="bi bi-three-dots-vertical"></i></li>
                    </ul>
                    <ul className='dashboard_products'>
                        <li><i className="bi bi-square"></i><img src='https://i.pinimg.com/474x/68/76/66/6876669bbdb06208d8807acf36596cfd.jpg' alt='imag'></img>Jame</li>  
                        <li><p  className='text-red-600 bg-red-100 p-2 px-3 rounded-3xl'>
                    Cancled </p></li>
                        <li>Mandalay,Myanmar</li>
                        <li>12 Orders</li>
                        <li>$120.00</li>
                        <li><i className="bi bi-three-dots-vertical"></i></li>
                    </ul>
                </div>
            </div>
        </div>
    )
};

const Analytics = () => {
    return (
        <div className='admin_analytics_container flex flex-col gap-5'>
            <h1 className='w-full px-2 py-4 analytics_header'>Analytics</h1>
            <div className='dashboard_header'>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-box-seam"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Sales</p>
                    <h1>123</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-cart2"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Customers</p>
                    <h1>23</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-reception-4"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>View</p>
                    <h1>234</h1>
                </div>
                <div className='dashboard_header_blog'>
                    <div>
                        <i className="bi bi-bounding-box-circles"></i>
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                    <p>Message</p>
                    <h1>144</h1>
                </div>
            </div>
            <div>
                <VerticalAnalyticsChart />
            </div>
            <div >
                <AnalyticsTable />
            </div>
        </div>
    )
};
  
const AnalyticsTable = () => {
const data = [
    { name: "Product A", sales: 1200, target: 1500 },
    { name: "Product B", sales: 980, target: 1000 },
    { name: "Product C", sales: 450, target: 700 },
    { name: "Product D", sales: 1600, target: 1600 },
    ];
return (
    <div className="p-6 rounded-l w-full overflow-x-auto border-solid border-gray-300 border">
    <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
    <table className="min-w-full text-sm text-left text-gray-700">
        <thead>
        <tr className="text-xs uppercase text-gray-500 border-b">
            <th className="py-2 px-4">Product</th>
            <th className="py-2 px-4">Sales</th>
            <th className="py-2 px-4">Progress</th>
            <th className="py-2 px-4">Target</th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, idx) => {
            const percentage = Math.min((item.sales / item.target) * 100, 100);

            return (
            <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{item.name}</td>
                <td className="py-3 px-4">{item.sales}</td>
                <td className="py-3 px-4 w-1/2">
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                    className={`h-3 rounded-full ${
                        percentage >= 100 ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-xs text-gray-500 mt-1 block">
                    {percentage.toFixed(1)}%
                </span>
                </td>
                <td className="py-3 px-4">{item.target}</td>
            </tr>
            );
        })}
        </tbody>
    </table>
    </div>
);
};

const VerticalAnalyticsChart = () => {
const data = [
    { month: "Jan", growth: 80 },
    { month: "Feb", growth: 65 },
    { month: "Mar", growth: 95 },
    { month: "Apr", growth: 70 },
    { month: "May", growth: 90 },
    { month: "Jun", growth: 60 },
    { month: "Jul", growth: 65 },
    { month: "Aug", growth: 95 },
    { month: "Sep", growth: 70 },
    { month: "Oct", growth: 90 },
    { month: "Nov", growth: 60 },
    { month: "Dec", growth: 60 }
    ];
return (
    <div className=" text-black p-6 rounded-l w-full mx-auto border border-solid border-gray-300 bg-gray-800">
    <h2 className="text-2xl font-bold text-white mb-6 text-center">📈 Monthly Growth Analytics</h2>
    <div className="flex items-end justify-between h-64 gap-4 px-4">
        {data.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center w-full h-full">
            <div className="relative w-1 flex flex-col justify-end h-full  rounded-full overflow-hidden">
            <div
                className="w-full bg-gradient-to-t from-teal-400 to-green-400 rounded-full transition-all duration-700 ease-in-out"
                style={{ height: `${item.growth}%` }}
            />
            </div>
            <span className="mt-2 text-sm text-white">{item.month}</span>
            <span className="text-xs text-teal-300">{item.growth}%</span>
        </div>
        ))}
    </div>
    </div>
);
};

const Payments = () => {
    return (
        <div className="admin_payment_container flex flex-col gap-5">
            <h1 className="admin_payment_header">Payment</h1>
            <div className="admin_payment_table">
                <div className="admin_payment_header gap-5">
                    <div className="flex flex-col gap-3 w-full">
                        <div className="bg-[#c1d1d0] rounded-xl p-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-center mb-3 ">
                                <div className="flex items-center space-x-2 font-semibold text-[#1f1f1f]">
                                    <i className="fas fa-dollar-sign"></i>
                                    <h1 className='text-xl'>Total Revenue</h1>
                                </div>
                                <div className="text-[#1f1f1f] text-2xl cursor-pointer">•••</div>
                            </div>
                            <div className="text-[32px] font-extrabold text-[#1f1f1f] leading-none flex justify-between">
                                $783,156
                                <p className="text-[14px] text-[#6b6b6b] font-medium flex flex-col text-end gap-3"><span className="text-[14px] text-[#6b6b6b] font-medium">+28%</span>From the last week</p>
                            </div>
                        </div>
                        <div className="bg-[#cde3de] rounded-xl p-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-center mb-3 ">
                                <div className="flex items-center space-x-2 font-semibold text-[#1f1f1f]">
                                    <i className="fas fa-dollar-sign"></i>
                                    <h1 className='text-xl'>Maintenance Cost</h1>
                                </div>
                                <div className="text-[#1f1f1f] text-2xl cursor-pointer">•••</div>
                            </div>
                            <div className="text-[32px] font-extrabold text-[#1f1f1f] leading-none flex justify-between">
                                $783,156
                                <p className="text-[14px] text-[#6b6b6b] font-medium flex flex-col text-end gap-3"><span className="text-[14px] text-[#6b6b6b] font-medium">+28%</span>From the last week</p>
                            </div>
                        </div>
                    </div>
                    <img
                        alt="Line chart showing total revenue income and expense from 2018 to 2022 with data points and labels"
                        className="rounded-lg"
                        src="https://storage.googleapis.com/a1aa/image/aa831b7d-a552-4913-3b92-f8e9d866a5b0.jpg"
                    />
                </div>
                <div className='admin_orders_table admin_payment_table_payments'>
                    <h1 className='font-bold mt-4'>Payment Report</h1>
                    <ul className='admin_orders_table_header'>
                        <li>#</li>
                        <li>Name</li>
                        <li>Email</li>
                        <li>Date</li>
                        <li>Price</li>
                        <li>Status</li>
                    </ul>
                    <ul>
                        <li>1</li>
                        <li><img className='w-8 h-8 object-cover object-center rounded-sm' src='https://i.pinimg.com/474x/8c/2b/4b/8c2b4b428911a7b2a4560ddbf9b51e85.jpg' alt='shirt'></img>Name</li>
                        <li>admin@gmail.com</li>
                        <li>4/21/2025</li>
                        <li>$34452</li>
                        <li><p  className='text-green-600 bg-green-100 p-2 px-3 rounded-3xl'>
                        Paid </p></li>
                    </ul>
                    <ul>
                        <li>2</li>
                        <li><img className='w-8 h-8 object-cover object-center rounded-sm' src='https://i.pinimg.com/474x/8c/2b/4b/8c2b4b428911a7b2a4560ddbf9b51e85.jpg' alt='shirt'></img>Name</li>
                        <li>admin@gmail.com</li>
                        <li>4/21/2025</li>
                        <li>$34452</li>
                        <li><p  className='text-yellow-600 bg-yellow-100 p-2 px-3 rounded-3xl'>
                        Pending </p></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Settings = () => {
    return (
        <div className='admin_settings_container'>
            <h1 className='admin_settings_header'>Settings</h1>
            <div className='admin_settings_table'>
                <h1>Settings</h1>
                <ul className='admin_settings_table_header'>
                    <li>Account</li>
                    <li>Security</li>
                    <li>Notifications</li>
                    <li>Privacy</li>
                </ul>
            </div>
        </div>
    )
}


export default Admindashboard