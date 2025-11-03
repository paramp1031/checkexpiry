const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

/**
 * Reads the Excel file and returns all beer inventory data
 * @returns {Array} Array of beer objects
 */
function readBeerInventory() {
  try {
    // Try multiple possible paths for different deployment scenarios
    let filePath = path.join(process.cwd(), 'Bar_Inventory_Sample_125.xlsx');
    
    // If file doesn't exist, try __dirname (for local development)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, '..', 'Bar_Inventory_Sample_125.xlsx');
    }
    
    // If still doesn't exist, try root directory
    if (!fs.existsSync(filePath)) {
      filePath = path.resolve('Bar_Inventory_Sample_125.xlsx');
    }
    
    if (!fs.existsSync(filePath)) {
      throw new Error('Excel file not found. Please ensure Bar_Inventory_Sample_125.xlsx is in the root directory.');
    }
    
    const workbook = XLSX.readFile(filePath);
    
    // Assuming the first sheet contains the data
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data.map((row, index) => ({
      productName: row['Product Name'] || row['ProductName'] || row['product_name'] || '',
      brand: row['Brand'] || row['brand'] || '',
      volume: row['Volume (ml)'] || row['Volume'] || row['volume'] || '',
      batchNo: row['Batch No.'] || row['BatchNo'] || row['batch_no'] || row['Batch Number'] || '',
      stockDate: row['Stock Date'] || row['StockDate'] || row['stock_date'] || '',
      expiryDate: row['Expiry Date'] || row['ExpiryDate'] || row['expiry_date'] || '',
      storageLocation: row['Storage Location'] || row['StorageLocation'] || row['storage_location'] || ''
    }));
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw new Error('Failed to read Excel file: ' + error.message);
  }
}

/**
 * Checks which beers are expiring within the specified number of days
 * @param {number} days - Number of days to check (default: 5)
 * @returns {Array} Array of beers expiring within the specified days
 */
function getExpiringBeers(days = 5) {
  const allBeers = readBeerInventory();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + days);
  
  const expiringBeers = [];
  
  allBeers.forEach(beer => {
    if (!beer.expiryDate) return;
    
    // Try to parse the expiry date (handles multiple formats)
    let expiryDate = null;
    
    if (beer.expiryDate instanceof Date) {
      expiryDate = beer.expiryDate;
    } else if (typeof beer.expiryDate === 'string') {
      // Try different date formats
      expiryDate = new Date(beer.expiryDate);
      // If invalid, try Excel date parsing
      if (isNaN(expiryDate.getTime())) {
        const excelDate = XLSX.SSF.parse_date_code(beer.expiryDate);
        if (excelDate) {
          expiryDate = new Date(excelDate.y, excelDate.m - 1, excelDate.d);
        }
      }
    } else if (typeof beer.expiryDate === 'number') {
      // Excel serial date (days since 1900-01-01)
      if (beer.expiryDate > 0 && beer.expiryDate < 100000) {
        // Likely an Excel serial date
        const excelEpoch = new Date(1899, 11, 30);
        const msPerDay = 86400000;
        expiryDate = new Date(excelEpoch.getTime() + beer.expiryDate * msPerDay);
      } else {
        // Try XLSX date parsing
        const parsed = XLSX.SSF.parse_date_code(beer.expiryDate);
        if (parsed) {
          expiryDate = new Date(parsed.y, parsed.m - 1, parsed.d);
        }
      }
    }
    
    if (expiryDate && !isNaN(expiryDate.getTime())) {
      expiryDate.setHours(0, 0, 0, 0);
      
      // Check if expiry date is between today and target date
      if (expiryDate >= today && expiryDate <= targetDate) {
        // Format dates for display
        const formatDate = (date) => {
          if (!date) return '';
          if (typeof date === 'string') {
            // Try to parse string date
            const parsed = new Date(date);
            if (!isNaN(parsed.getTime())) {
              return parsed.toISOString().split('T')[0];
            }
            return date;
          }
          if (date instanceof Date) {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
          }
          if (typeof date === 'number') {
            // Excel serial date (days since 1900-01-01)
            const excelEpoch = new Date(1899, 11, 30);
            const msPerDay = 86400000;
            const dateObj = new Date(excelEpoch.getTime() + date * msPerDay);
            return dateObj.toISOString().split('T')[0];
          }
          return date;
        };
        
        expiringBeers.push({
          ...beer,
          expiryDate: formatDate(expiryDate),
          stockDate: formatDate(beer.stockDate)
        });
      }
    }
  });
  
  return expiringBeers;
}

module.exports = {
  readBeerInventory,
  getExpiringBeers
};
