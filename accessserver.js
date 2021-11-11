import Arweave from "arweave";
import fs from 'fs'

let port = 1990

const arweave = Arweave.init({
    host: "localhost",
    port: port,
    protocol: "http"
});

async function main() {
    
    let data = fs.readFileSync('file.file');

    let key = await arweave.wallets.generate()

    let transaction = await arweave.createTransaction({ data: data }, key);
    transaction.addTag('Content-Type', 'application/pdf');

    await arweave.transactions.sign(transaction, key);

    let uploader = await arweave.transactions.getUploader(transaction);

    console.log(transaction)

    while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    console.log(await arweave.transactions.getData('SY0guQodTd58v32SeBN3dRPG5w-K-lvEEOlHa-YLEsM', {decode:true, string:true}))
}

main()