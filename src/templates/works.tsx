import React from 'react';
import { Link, graphql } from 'gatsby';
import { Layout, Work, SectionTitle, Header, Content, Pagination } from '../components';
import Helmet from 'react-helmet';
import config from '../../config/SiteConfig';
import Workmodel from '../models/Work';
import styled from 'styled-components';
import { media } from '../utils/media';

export const Wrapper: any = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  margin: 0 auto;
  height: auto;
  max-width: ${(props: any) => (props.fullWidth ? '100%' : '100rem')};
  padding: ${(props: any) => (props.fullWidth ? '0' : '0 6rem')};
  @media ${media.tablet} {
    padding: ${(props: any) => (props.fullWidth ? '0' : '0 3rem')};
  }
  @media ${media.phone} {
    padding: ${(props: any) => (props.fullWidth ? '0' : '0 1rem')};
    flex-direction: column;
  }
`;

interface Props {
  pageContext: {
    works: Workmodel[];
  };
}

export default class WorksPage extends React.Component<Props> {
  public render() {
    const { works } = this.props.pageContext;

    return (
      <Layout>
        <Helmet title={`works | ${config.siteTitle}`} />
        <Header>
          <Link to="/">{config.siteTitle}</Link>
          <SectionTitle uppercase={true}>my works</SectionTitle>
        </Header>
        <Wrapper>
          {works.map(work => (
            <Work title={work.title} img={work.img} key={work.title} link={work.link} />
          ))}
        </Wrapper>
      </Layout>
    );
  }
}
