import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { media } from '../utils/media';

const Workbox: any = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin: 0 2rem;
  margin-top: 3.5rem;
  margin-bottom: 3.5rem;
  width:20rem;
  min-width: 20rem;
  height: 15rem;
  min-height: 15rem;
  background: url(${(props: any) => props.bg}) center no-repeat;
  background-size: cover;
  &:hover div {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Title = styled.h2`
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  margin:0;
  width: 100%;
  height: auto;
  line-height: 2;
`;

// const Description = styled.div`
//   background: rgba(255, 255, 255, 0.6);
//   margin: 0;
//   width: 100%;
//   height: 4rem;
//   opacity:0;
//   transition： all 0.3s;
//   transform: translateY(100%)
// `;

interface Props {
  title: string;
  img: string;
  link: string;
}

export class Work extends React.PureComponent<Props> {
  public render() {
    const { title, img, link } = this.props;

    return <Workbox bg={img}>
      <button onClick={() => alert('123')}>123</button>
        <Title>
          <Link to={link}>{title}</Link>
        </Title>
      </Workbox>;
  }
}
