import React, { ChangeEvent, FC, FormEvent, PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { OnlineContext } from '../../App';
import { CreateTodoData, CreateTodoVariables } from './index';

interface Props {
  createTodo: MutationFn<CreateTodoData, CreateTodoVariables>;
  error: boolean;
  loading: boolean;
}

interface Online {
  online: boolean;
}

class TodosCreate extends PureComponent<Props & Online> {
  public state = {
    dirty: false,
    title: '',
    valid: false,
  };

  public render() {
    const { error, loading, online } = this.props;
    const { dirty, title, valid } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        {!online && <div>OFFLINE</div>}
        <input disabled={loading} onChange={this.handleChange} value={title} />
        <button disabled={!valid || loading} type="submit">
          Create
        </button>
        {dirty && !valid && <div>Required</div>}
        {error && <div>Error Creating</div>}
      </form>
    );
  }

  private handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const valid = title.trim() !== '';
    this.setState({ dirty: true, title, valid });
  };

  private handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { createTodo } = this.props;
    const { title } = this.state;
    await createTodo({
      variables: {
        title,
      },
    });
    this.setState({
      dirty: false,
      title: '',
      valid: false,
    });
  };
}

const TodosCreateWithOnline: FC<Props> = props => (
  <OnlineContext.Consumer>
    {online => <TodosCreate {...props} online={online} />}
  </OnlineContext.Consumer>
);

export default TodosCreateWithOnline;
