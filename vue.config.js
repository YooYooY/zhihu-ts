module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://api.vikingship.xyz"
        // "http://api.vikingship.xyz/api/columns?currentPage=1&pageSize=5
      }
    }
  }
}
