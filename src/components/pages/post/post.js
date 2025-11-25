import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PostContent, PostComments } from './components';
import { useServerRequest } from '../../../hooks';
import { loadPostAsync } from '../../../actions';
import { selectPost } from '../../selectors';
import styled from 'styled-components';

const PostContainer = ({ className }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const requestServer = useServerRequest();
    const post = useSelector(selectPost);
    
    useEffect(() => {
        dispatch(loadPostAsync(requestServer, params.id));
    }, [dispatch, requestServer, params.id]);
    
    return (
        <div className={className}>
            <PostContent post={post}/>
            <PostComments postId={params.id}/>
        </div>
    );

};

export const Post = styled(PostContainer)`
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: left;
	gap: 20px;
	padding: 20px;
	margin: 20px;
	width: 100%;
	max-width: 1000px;
`;

PostContainer.propTypes = {
	className: PropTypes.string,
};