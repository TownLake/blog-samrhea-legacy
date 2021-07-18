import React from "react"

import "./product-grid.css"

const $ = {}
$["access"] = require("../../../static/media/icons/access").pathD
$["registrar"] = require("../../../static/media/icons/access").pathD
$["gateway"] = require("../../../static/media/icons/access").pathD
$["tunnel"] = require("../../../static/media/icons/access").pathD

const products = [
  {
    title: "Cloudflare Access",
    path: "https://blog.cloudflare.com/cloudflare-one/",
    icon: "cloudflare-one",
  },
  {
    title: "Cloudflare Registrar",
    path: "https://blog.cloudflare.com/cloudflare-for-teams-products/",
    icon: "zero-trust",
  },
  {
    title: "Cloudflare Gateway",
    path: "https://blog.cloudflare.com/cloudflare-for-teams-products/",
    icon: "zero-trust",
  },
  {
    title: "Cloudflare Tunnel",
    path: "https://blog.cloudflare.com/cloudflare-for-teams-products/",
    icon: "zero-trust",
  },
]

const ProductGridLink = ({ product }) => (
  <a className="ProductGrid--link" data-wrap-title={product.wrap} href={product.href || `${product.path}`}>
    <svg viewBox="0 0 48 48"><path d={$[product.icon]}/></svg>
    <span>{product.title}</span>
  </a>
)

const ProductGridColumns = ({ numColumns }) => {
  const itemsPerColumn = Math.ceil(products.length / numColumns)

  const columns = []
  let n = 0
  for (let i = 0; i < numColumns; i += 1) {
    columns.push([])

    for (let j = 0; j < itemsPerColumn; j += 1) {
      if (n >= products.length) {
        break;
      }
      columns[i].push(products[n])
      n += 1
    }
  }

  return (
    <React.Fragment>
      {columns.map((products, i) => (
        <div key={i} className="ProductGrid--column">
          {products.map((product, j) => (
            <ProductGridLink key={j} product={product}/>
          ))}
        </div>
      ))}
    </React.Fragment>
  )
}

const ProductGrid = () => (
  <div className="ProductGrid">
    <div className="ProductGrid--content" data-columns="4">
      <ProductGridColumns numColumns={4}/>
    </div>
    <div className="ProductGrid--content" data-columns="3">
      <ProductGridColumns numColumns={3}/>
    </div>
    <div className="ProductGrid--content" data-columns="2">
      <ProductGridColumns numColumns={2}/>
    </div>
    <div className="ProductGrid--content" data-columns="1">
      <ProductGridColumns numColumns={1}/>
    </div>
  </div>
)

export default PreviousProducts