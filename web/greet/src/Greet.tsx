import { ethers } from "ethers";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { address, abi} from "./artifact/greet.json";
import { useState } from "react";
import {Greeter} from "./typechain/Greeter" 

const Greet = () => {

    let provider : Web3Provider;
    let signer : JsonRpcSigner;
    let greetContract : Greeter;

    const [message, setMessage] = useState("");
    const [inputText, setInputText] = useState("")

    const connect = async () => {
        provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts",[]);
        signer = provider.getSigner();
        console.log(address, abi);
        greetContract = new ethers.Contract(address, abi, signer) as Greeter;
    }

    const greet = async () => {
        console.log("Greet");
        if ( !greetContract )
            await connect();
        setMessage(await greetContract.greet());
    }

    const setGreet = async () => {
        if ( !greetContract )
            await connect();
        const tx = await greetContract.setGreeting(inputText);
        await tx.wait();
        await greet();
    }

    const donate = async () => {
        if ( !greetContract )
            await connect();
        const tx = await greetContract.donate( {
            value: ethers.utils.parseEther("0.01")
        });
        await tx.wait();
        console.log("Donate successful");
    }

    const balance = async () => {
        if ( !greetContract )
            await connect();
        console.log( +(await greetContract.balance()) );
    }

    return <div>
        <h1>Greet</h1>
        <div>{message}</div>
        <input type="text" onChange={ (e) => setInputText(e.target.value)} />
        <button onClick={greet}>Greet</button> 
        <button onClick={setGreet}>SetGreet</button> 
        <hr />
        <h1>Payment</h1>
        <button onClick={donate}>Donate</button>
        <button onClick={balance}>Balance</button>
        <hr />
    </div>
}

export default Greet;