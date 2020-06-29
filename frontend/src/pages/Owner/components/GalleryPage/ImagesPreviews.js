import React from 'react';
import ImagePreview from './ImagePreview';

const ImagesPreviews = ({ images, restaurantId }) => {
	if (!images?.length) return <div className="mb-3 mt-2">
		<h3> No images in restaurant gallery </h3>
	</div>

	return <>
		<div className="container my-3">
			<h3>Images in restaurant gallery</h3>
			<div className="row">
				{
					images.map((image, i) =>
						<div className="col-6" key={`prev-${i}`}>
							<ImagePreview image={image} restaurantId={restaurantId} />
						</div>
					)
				}
			</div>
		</div>
	</>
}

export default ImagesPreviews;