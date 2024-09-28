

const baseUrl = "https://dog.ceo/api/breeds/image/random/";
const numberPicsAtOnce = 7;   // number of photos loaded at one time; 0 < numberPicsAtOnce >= 50.



const btnLoading = document.querySelector(".main__btn_loading");
btnLoading.addEventListener("click", OnBtnLoadingClick);

let numLoadingImgs = 0;   // number of images currently loading.

async function OnBtnLoadingClick()
{
	const url = baseUrl + numberPicsAtOnce;

	ShowBannerError(false);
	ShowBannerLoading(true);

	try
	{
		const response = await fetch(url);
		if(!response.ok)
			throw Error("Error loading data");

		const data = await response.json();
		if(!HandleLoadedData(data))
			throw Error("Error loading data");
	}
	catch(err)
	{
		ShowBannerError(true, err.message);
		ShowBannerLoading(false);
	}
}

function HandleLoadedData(data)
{
	if(typeof(data) !== "object" ||
		!data.hasOwnProperty("status") ||
		data["status"] !== "success" ||
		!data.hasOwnProperty("message"))
	{
		return false;
	}

	const urls = data["message"];

	if(!Array.isArray(urls) ||
	urls.length !== numberPicsAtOnce)
	{
		return false;
	}

	return InsertImagesToLayout(urls);
}

function InsertImagesToLayout(urls)
{
	const imageContainer = document.querySelector(".main__container");

	for(const url of urls)
	{
		if(typeof(url) !== "string")
			return false;

		InsertImageToLayout(imageContainer, url);
	}
	return true;
}

function InsertImageToLayout(imageContainer, url)
{
	const fileName = url.replace(/\\/g, "/").split("/").pop();	

	let divElement = document.createElement("div");
	divElement.className = "main__container-item";
	divElement.innerHTML = 
		`	<a href="${url}"><img src="${url}" alt="Picture in the gallery"></a>
			<span>&nbsp${fileName}&nbsp</span>`;

	const imgElement = divElement.querySelector("img");
	imgElement.onload = imgElement.onerror = () =>
	{
		if(--numLoadingImgs == 0)
			ShowBannerLoading(false);
	};
	++ numLoadingImgs;

	imageContainer.appendChild(divElement);
}


function ShowBannerError(show, text)
{
	let bannerErrorElement = document.querySelector(".banner-error");
	if(show)
		bannerErrorElement.innerHTML = text;
	bannerErrorElement.style["display"] = (show ? "block" : "none");
}

function ShowBannerLoading(show)
{
	document.querySelector(".banner-loading").style["display"] = 
		(show ? "block" : "none");
}
