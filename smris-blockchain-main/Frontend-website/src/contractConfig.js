// Import the "Dictionaries" you just added
import Identity from './abis/Identity.json';
import Record from './abis/Record.json';
import VRoom from './abis/VRoom.json';

// ✅ The Live Sepolia Addresses
export const IDENTITY_ADDRESS = "0xF35512D2Bf0a3EDC7252e887b4E9Aa02C011C352";
export const VROOM_ADDRESS    = "0xEFE1164d6Cf984eEA3890BC9287cA1ba0E27f4E6";
export const RECORD_ADDRESS   = "0x9c1055f6058218535777e52d3dfE448254B91372";

// ✅ The Network ID (Sepolia)
export const CHAIN_ID = 11155111; 

// ✅ Export the ABIs automatically (No more manual typing!)
export const IDENTITY_ABI = Identity.abi;
export const RECORD_ABI   = Record.abi;
export const VROOM_ABI    = VRoom.abi;