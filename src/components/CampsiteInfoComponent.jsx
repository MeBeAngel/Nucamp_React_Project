import React, { Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);


//
function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </CardBody>
            </Card>
        </div>
    )
}

//
function RenderComments({ comments, addComment, campsiteId }) {

    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                {comments.map(comment => <p>{`${comment.text} \n --${comment.author}, ${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}`}</p>)}
                <CommentForm campsiteId={campsiteId} addComment={addComment} />
            </div>
        )
    }
    else {
        <div></div>
    }
}

//
function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }

    if (props.campsite) {
        return <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments
                        comments={props.comments}
                        addComment={props.addComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        </>
    }
    else {
        <div></div>
    }
}


class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            value: {
                rating: 1,
                author: '',
                text: ''
            }
        }
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen

        });
    }

    handleChange = (e) => {
        this.setState({
            value: { [e.target.name]: e.target.value }
        })
    }


    handleSubmit(values) {
        this.toggleModal();
        this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render() {
        return (
            <>
                <Button onClick={this.toggleModal} outline><i class="fa-solid fa-pencil" /> Submit Comment </Button>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalBody>
                        <ModalHeader className="mb-3" toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <div className="form-group">
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select
                                    className="form-control"
                                    model=".rating"
                                    id="rating"
                                    name="rating"
                                    onChange={this.handleChange}
                                    value={this.state.value.rating} >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Control.select>
                            </div>

                            <div className="form-group">
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text
                                    className="form-control"
                                    model=".author" id="author"
                                    name="author"
                                    placeholder="Your Name"
                                    onChange={this.handleChange}
                                    value={this.state.value.author}
                                    validators={{
                                        minLength: minLength(2),
                                        maxLength: maxLength(15)
                                    }} ></Control.text>
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <Label htmlFor="text">Comment</Label>
                                <Control.textarea
                                    className="form-control"
                                    rows="6"
                                    model=".text"
                                    id="text"
                                    name="text"
                                    onChange={this.handleChange}
                                    value={this.state.value.text} ></Control.textarea>
                            </div>
                            <Button type="submit" className="bg-primary border-0">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                <RenderComments />
            </>
        )
    }
}


export default CampsiteInfo;