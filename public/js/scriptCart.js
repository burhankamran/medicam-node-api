   const deleteProduct=(btn)=>{

    const prodId=btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken=btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement=btn.closest('article');
    const price=document.getElementById('p1');
    const total=document.getElementById('p2');
    fetch('/cart/' + prodId,{
        method:'DELETE',
        headers:{
            'csrf-token':csrfToken
        }
    })
    .then(results=>{
        return results.json();
    })
    .then(data=>{
        console.log(data);
        productElement.remove();
        price.textContent=data.totalPrice;
        total.textContent=data.productsLength;
    })
    .catch(err=>console.log(err,'1'));
    
}