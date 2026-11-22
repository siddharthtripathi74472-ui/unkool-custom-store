import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const WA = "917447248530";
const products = [
  { id:"tee", name:"Custom T-shirt", price:599, emoji:"👕", hint:"Your fit. Your rules.", color:"#f6d6c9" },
  { id:"mug", name:"Custom Mug", price:349, emoji:"☕", hint:"Sip something personal.", color:"#d8e9ff" },
  { id:"key", name:"Custom Keychain", price:199, emoji:"🔑", hint:"Little thing. Big meaning.", color:"#f8d8f1" },
  { id:"pillow", name:"Custom Pillow", price:499, emoji:"🛋️", hint:"Make comfort personal.", color:"#d9f1d9" }
];
function App(){
  const [product,setProduct] = useState(products[0]);
  const [text,setText] = useState("YOUR DESIGN");
  const [colour,setColour] = useState("#ffffff");
  const [size,setSize] = useState("M");
  const [qty,setQty] = useState(1);
  const [photo,setPhoto] = useState("");
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [busy,setBusy] = useState(false);
  const total = product.price * qty;
  const orderText = useMemo(()=>[
    "Hi UNKOOL! I want to place a custom order.",
    `Product: ${product.name}`, `Custom text: ${text || "No text"}`,
    `Text colour: ${colour}`, ...(product.id==="tee"?[`Size: ${size}`]:[]),
    `Quantity: ${qty}`, `Total: ₹${total}`, `Name: ${name}`, `Phone: ${phone}`,
    `Address: ${address}`, photo ? "I have added a design/photo in the customiser; I will attach the image here." : ""
  ].filter(Boolean).join("\n"),[product,text,colour,size,qty,total,name,phone,address,photo]);
  function sendWhatsApp(){ if(!name.trim() || !phone.trim()){alert("Please enter your name and phone number.");return;} window.open(`https://wa.me/${WA}?text=${encodeURIComponent(orderText)}`,"_blank"); }
  async function payNow(){
    if(!name.trim() || !phone.trim()){alert("Please enter your name and phone number.");return;}
    setBusy(true);
    try{
      const r=await fetch("/api/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:total*100,currency:"INR",receipt:"unkool_"+Date.now()})});
      if(!r.ok) throw new Error("Payment setup is not ready yet. Please use WhatsApp order for now.");
      const order=await r.json();
      if(!window.Razorpay) throw new Error("Razorpay checkout did not load. Please try WhatsApp order.");
      const rz=new window.Razorpay({key:order.keyId,amount:order.amount,currency:order.currency,name:"UNKOOL",description:product.name,order_id:order.id,
        prefill:{name,contact:phone},theme:{color:"#171717"},
        handler:async(response)=>{
          const verify=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...response,amount:total*100,product:product.name,customText:text,quantity:qty,customerName:name,phone})});
          if(verify.ok){window.open(`https://wa.me/${WA}?text=${encodeURIComponent(orderText+"\nPayment: successful. Payment ID: "+response.razorpay_payment_id)}`,"_blank");alert("Payment verified! WhatsApp order details opened.");}
          else alert("Payment received but verification needs support. Contact UNKOOL on WhatsApp with your payment ID.");
        }});
      rz.open();
    }catch(e){alert(e.message+" You can still send your custom order on WhatsApp.");}
    finally{setBusy(false);}
  }
  function upload(e){const f=e.target.files?.[0];if(!f)return;if(f.size>5*1024*1024){alert("Please choose an image under 5 MB.");return;}const reader=new FileReader();reader.onload=()=>setPhoto(reader.result);reader.readAsDataURL(f);}
  return <><div className="announcement">FREE YOUR IMAGINATION ✳ MADE TO BE YOURS ✳</div>
    <header><a className="brand" href="#">UNKOOL<span>™</span></a><nav><a href="#shop">SHOP</a><a href="#customise">CUSTOMISE</a><a href="#how">HOW IT WORKS</a></nav><a className="nav-pill" href="#customise">MAKE YOURS ↗</a></header>
    <main><section className="hero"><div className="hero-copy"><p className="eyebrow">NOT MADE TO BLEND IN</p><h1>Your idea.<br/><em>Your thing.</em></h1><p className="lead">Custom tees, mugs, keychains & pillows. Put your personality on something you can hold.</p><a className="button dark" href="#customise">START CREATING <b>↘</b></a><div className="micro">NO RULES. JUST YOUR VIBE.</div></div><div className="hero-art"><div className="sun"></div><div className="sticker">MAKE<br/>IT<br/><strong>YOURS!</strong></div><div className="hero-product">👕</div><span className="scribble">one of one ✳</span></div></section>
    <section id="shop" className="shop"><div className="section-head"><div><p className="eyebrow">THE GOOD STUFF</p><h2>Pick your canvas<span>.</span></h2></div><p>Choose a favourite. Then make it unmistakably yours.</p></div><div className="product-grid">{products.map(p=><button className={`product-card ${product.id===p.id?"selected":""}`} key={p.id} onClick={()=>{setProduct(p);document.querySelector("#customise").scrollIntoView({behavior:"smooth"});}}><div className="product-visual" style={{background:p.color}}><span>{p.emoji}</span><small>UNKOOL / CUSTOM</small></div><div className="product-info"><b>{p.name}</b><span>From ₹{p.price} ↗</span><small>{p.hint}</small></div></button>)}</div></section>
    <section id="customise" className="custom-section"><div className="section-head"><div><p className="eyebrow">YOUR PERSONAL STUDIO</p><h2>Make it <span>you.</span></h2></div><p>Play around. Your custom idea starts here.</p></div><div className="studio"><div className="preview-wrap"><div className="preview-top"><span>LIVE PREVIEW</span><span>✳ ONE OF ONE</span></div><div className={`mockup ${product.id}`}><div className="mock-shape">{product.emoji}</div><div className="artwork" style={{color:colour}}>{photo&&<img src={photo} alt="Your uploaded design"/>}<b>{text || "YOUR DESIGN"}</b></div></div><p className="preview-note">Preview is a visual guide. Final print placement may vary slightly.</p></div><div className="controls"><div className="control-block"><label>01 / PRODUCT</label><div className="choice-row">{products.map(p=><button key={p.id} className={product.id===p.id?"chip active":"chip"} onClick={()=>setProduct(p)}>{p.emoji} {p.name.replace("Custom ","")}</button>)}</div></div><div className="control-block"><label>02 / YOUR WORDS</label><input maxLength="32" value={text} onChange={e=>setText(e.target.value)} placeholder="Add a name, quote or phrase"/><div className="helper">Up to 32 characters</div></div><div className="control-block"><label>03 / ADD YOUR IMAGE</label><label className="upload">＋ Upload a photo or design<input type="file" accept="image/*" onChange={upload}/></label>{photo&&<button className="remove" onClick={()=>setPhoto("")}>Remove image</button>}<div className="helper">JPG / PNG, max 5 MB. For WhatsApp orders, attach the image in the chat.</div></div><div className="control-block"><label>04 / TEXT COLOUR</label><div className="swatches">{["#ffffff","#171717","#ffdf00","#ff6b6b","#70d6ff"].map(c=><button aria-label={c} key={c} className={colour===c?"swatch chosen":"swatch"} style={{background:c}} onClick={()=>setColour(c)}/>)}</div></div>{product.id==="tee"&&<div className="control-block"><label>05 / SIZE</label><div className="choice-row">{["S","M","L","XL","XXL"].map(s=><button className={size===s?"chip active":"chip"} onClick={()=>setSize(s)} key={s}>{s}</button>)}</div></div>}<div className="control-block"><label>QUANTITY</label><div className="quantity"><button onClick={()=>setQty(Math.max(1,qty-1))}>−</button><b>{qty}</b><button onClick={()=>setQty(Math.min(20,qty+1))}>＋</button></div></div><div className="price-line"><span>ESTIMATED TOTAL</span><strong>₹{total.toLocaleString("en-IN")}</strong></div><div className="customer-fields"><input placeholder="Your name *" value={name} onChange={e=>setName(e.target.value)}/><input placeholder="WhatsApp / phone number *" value={phone} onChange={e=>setPhone(e.target.value)}/><textarea placeholder="Delivery address (optional)" value={address} onChange={e=>setAddress(e.target.value)}/></div><button className="button yellow full" onClick={sendWhatsApp}>SEND CUSTOM ORDER ON WHATSAPP ↗</button><button className="button dark full" disabled={busy} onClick={payNow}>{busy?"PLEASE WAIT…":"PAY SECURELY WITH RAZORPAY →"}</button><p className="tiny">Payment activates after Razorpay keys are added by the store owner.</p></div></div></section>
    <section id="how" className="how"><p className="eyebrow">EASY AS 1, 2, 3</p><h2>From your head<br/>to your hands<span>.</span></h2><div className="steps"><article><b>01</b><h3>Pick it</h3><p>Choose your favourite UNKOOL product.</p></article><article><b>02</b><h3>Make it yours</h3><p>Add your text, upload your image and preview your idea.</p></article><article><b>03</b><h3>Get it</h3><p>Send your order on WhatsApp or pay online when checkout is enabled.</p></article></div></section>
    <section className="closing"><div><p className="eyebrow">THIS IS YOUR SIGN</p><h2>Stay weird.<br/><em>Stay UNKOOL.</em></h2></div><a className="button dark" href="#customise">CREATE SOMETHING ↗</a></section></main>
    <footer><a className="brand" href="#">UNKOOL<span>™</span></a><span>SET YOUR OWN STANDARD.</span><a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">TALK TO US ↗</a><small>© {new Date().getFullYear()} UNKOOL. Made for your kind of different.</small></footer>
    </>;
}
createRoot(document.getElementById("root")).render(<App/>);