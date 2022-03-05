import { useState, useEffect } from "react";

const Login = () => {

    const [account, setAccount] = useState('');
    const [network, setNetwork] = useState('');

    useEffect(() => {
        handleAccountsChanged();
        handleNetworkChanged();
        return () =>{
            window.ethereum.removeAllListener();
        }
    }, []);

    const connect = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account: string = accounts[0];
        setAccount(account);
    }

    const handleAccountsChanged = async () => {
        window.ethereum.on('accountsChanged', (newAccount: string) => {
            setAccount(newAccount);
        });
    }

    const addToken = async () => {
        try {
            const result = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: '0x0aBABf7Cd9De9508D1B69B2dd2d374fA88d384d3',
                        symbol: 'DAI',
                        decimals: 18,
                        image: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=022',
                    },
                },
            });
            if (result) {
                console.log('FOO successfully added to wallet!');
            } else {
                throw new Error('Something went wrong.');
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const addNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x60',
                    chainName: 'Bitkub Chain',
                    nativeCurrency: {
                        name: 'BitKub Token',
                        symbol: 'KUB', // 2-6 characters long
                        decimals: 18,
                    },
                    rpcUrls: ['https://rpc.bitkubchain.io'],
                    blockExplorerUrls: ['https://bkcscan.com']
                }],
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    const nameNetwork: { [key: string]: string} = {
        "0x1": "Ethereum Mainnet",
        "0x3": "Ropsten Test Network",
        "0x4": "Rinkeby Test Network",
        "0x5": "Goerli Test Netwok",
        "0x60": "Bitkub Chain",
    }

    const handleNetworkChanged = async () => {
        window.ethereum.on('chainChanged', (chainId: string) => {
            console.log("Chain id: ", chainId);
            console.log("nameNetwork: ", nameNetwork);
            const selectNetwork = nameNetwork[chainId];
            console.log("Network: ", selectNetwork);
            setNetwork(selectNetwork);
        } ) 
    }

    return <div>
        <h1>Login</h1>
        <div>Account: {account} </div>
        <div>Network: {network} </div>
        <button onClick={connect}>Login</button>
        <button onClick={addToken}>Add token</button>
        <button onClick={addNetwork}>Add network</button>
    </div>
}

export default Login;