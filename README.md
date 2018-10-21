#paxos examples


## Example 1
To start the server
`cd paxos-repo/; node server.js`

You should see `Example app listening on port 3000` which means the server has started.

POST url
`/messages`
payload is
```
{
    "message": "foo"
}
```

GET url
`/messages/:hash`



## Example 2
file path for the example
`paxos-repo/gifts-example/find-pair.js`


To see gifts
`cd paxos-repo/; npm run-script gifts`

To change the amount
`vi package.json` and update the amount for the `gifts` script command with the required amount

For now the in memory model use case is uncommented, to see the stream use case one uncomment that one to print the result