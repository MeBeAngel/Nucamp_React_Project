import React, { Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { Link } from 'react-router-dom';

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);


//
function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={campsite.image} alt={campsite.name} />
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
function RenderComments({ comments }) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                {comments.map(comment => <p>{`${comment.text} \n --${comment.author}, ${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}`}</p>)}
                <CommentForm />
            </div>
        )
    }
    else {
        <div></div>
    }
}

// Render
function CampsiteInfo(props) {
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
                    <RenderComments comments={props.comments} />
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
            ratingVal: 1,
            authorVal: '',
            textVal: '',
        }
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen

        });
    }

    handleChange = (e) => {
        this.setState({ [`${e.target.name}Val`]: e.target.value })
    }

    handleCommentSubmit = () => {
        console.log(`Rating: ${this.state.ratingVal}, Author: ${this.state.authorVal}, Text: ${this.state.textVal}`);
        alert(`Rating: ${this.state.ratingVal}, Author: ${this.state.authorVal}, Text: ${this.state.textVal}`)
        this.toggleModal();
    }

    render() {
        return (
            <>
                <Button onClick={this.toggleModal} outline><i class="fa-solid fa-pencil" /> Submit Comment </Button>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalBody>
                        <ModalHeader className="mb-3" toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <LocalForm>
                            <div className="form-group">
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select
                                    className="form-control"
                                    model=".rating"
                                    id="rating"
                                    name="rating"
                                    onChange={this.handleChange}
                                    value={this.state.ratingVal} >
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
                                    value={this.state.authorVal}
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
                                    value={this.state.textVal} ></Control.textarea>
                            </div>
                            <Button className="bg-primary border-0" onClick={this.handleCommentSubmit}>Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}


export default CampsiteInfo;