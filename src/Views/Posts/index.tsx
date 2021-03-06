import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { StoreTypes } from '../../Store';
import { getPosts, logOut } from '../../Actions';
import Post from '../../Components/Post';
import AddPost from '../../Components/AddPost';
import SearchBar from '../../Components/searchBar';
import firebase from '../../firebase';
import './posts.css';

interface Props {
	user: StoreTypes['user'];
	posts: StoreTypes['posts'];
	getPosts: (user: StoreTypes['user']) => void;
	logOut: () => void;
}

class PostsPage extends Component<Props> {
	
	componentDidMount() {
		const { user } = this.props;
		if (user) {
			this.props.getPosts(user);
		}
	}

	logOutUser() {
		firebase.auth().signOut();
		this.props.logOut();
	}

	render() {
		const { posts, user } = this.props;

		if (!user) {
			return (<Redirect to="/login" />)
		}

		if (!posts) {
			return (<p>Loading</p>)
		}

		if (posts.length < 1) {
			return (
				<div>
					<p>There are no posts. Start a new one!</p>
					<AddPost />
				</div>
			)
		}

		return (
			<div>
				<SearchBar />
				<div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
					<div className="feed">
						<AddPost />

						{posts.map(post => (
							<Post key={post.id} post={post} />
						))}

						{user ?
							(<div>
								<button onClick={() => this.logOutUser()}>
									<p>Log out</p>
								</button>
							</div>)
						: null}
					</div>
				</div>
			</div>
		)
	}
}

const mapToProps = ({ posts, user }: Props) => ({ posts, user });

export default connect(mapToProps, { getPosts, logOut })(PostsPage);