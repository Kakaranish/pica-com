import React from 'react';
import ImagePreview from './ImagePreview';

const ImagesPreviews = ({ images, restaurantId }) => {
	if (!images?.length) return <div className="container m-3">
		<h3> No images in gallery </h3>
	</div>
	return <>
		<div className="container my-3">
			<h3>Images in gallery</h3>
			<div className="row">
				{
					images.map((image, i) => <>
						<div className="col-6" key={`prev-${i}`}>
							<ImagePreview image={image} restaurantId={restaurantId} />
						</div>
					</>)
				}
			</div>
		</div>
	</>
}

export default ImagesPreviews;