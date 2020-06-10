import React from 'react';
import ImagePreview from './ImagePreview';

const ImagesPreviews = ({ pictures, restaurantId }) => {
	if (!pictures?.length) return <h3> No images yet </h3>
	return <>
		<div className="container my-3">
			<h3>Images in gallery</h3>
			<div className="row">
				{
					pictures.map((picture, i) => <>
						<div className="col-6" key={`prev-${i}`}>
							<ImagePreview picture={picture} restaurantId={restaurantId} />
						</div>
					</>)
				}
			</div>
		</div>
	</>
}

export default ImagesPreviews;