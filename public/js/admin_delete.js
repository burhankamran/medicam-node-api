const deleteProduct=(btn)=>{
    const prodId=btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken=btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement=btn.closest('article');
  
    fetch('/admin/delete/' + prodId,{
        method:'DELETE',
        headers:{
            'csrf-token':csrfToken
        }
    })
    .then(results=>{
       productElement.remove();
    })
    .catch(err=>console.log(err));
    
}