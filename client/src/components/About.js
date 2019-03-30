import React from 'react';
import { Card, CardDeck } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

import Subham from '../assets/images/dp_subham.png';
import MrRedible from '../assets/images/dp_mr-redible.jpg';
import Praduman from '../assets/images/dp_praduman.jpeg';

/* This component shows the features available */
class About extends React.Component {
  about = [
    {
      img: Subham,
      name: 'Subham Agarwal',
      desc: (
        <span>
          Jadavpur University, IT, 3<sup>rd</sup> year
        </span>
      ),
      profiles: [
        {
          icon: FaGithub,
          link: 'https://github.com/subham301',
          color: 'black'
        },
        {
          icon: FaFacebook,
          link: 'https://www.facebook.com/subham.agarwal.1004837',
          color: '#3b5998'
        }
      ]
    },
    {
      img: MrRedible,
      name: 'Rishav Agarwal',
      desc: (
        <span>
          Jadavpur University, IT, 3<sup>rd</sup> year
        </span>
      ),
      profiles: [
        {
          icon: FaGithub,
          link: 'https://github.com/Rishav-Agarwal',
          color: 'black'
        },
        {
          icon: FaTwitter,
          link: 'https://twitter.com/MrRedible',
          color: '#00acee'
        },
        {
          icon: FaLinkedin,
          link: 'https://www.linkedin.com/in/mr-redible/',
          color: '#4875b4'
        },
        {
          icon: FaFacebook,
          link: 'https://www.facebook.com/rishav.agarwal97',
          color: '#3b5998'
        }
      ]
    },
    {
      img: Praduman,
      name: 'Praduman Kumar',
      desc: (
        <span>
          Jadavpur University, IT, 3<sup>rd</sup> year
        </span>
      ),
      profiles: [
        {
          icon: FaGithub,
          link: 'https://github.com/theSparkPlug',
          color: 'black'
        },
        {
          icon: FaFacebook,
          link: 'https://www.facebook.com/praduman.kumar.39982',
          color: '#3b5998'
        }
      ]
    }
  ];

  AboutCard = props => (
    <Card style={{ maxWidth: '250px' }} className="mx-msm-auto">
      <Card.Img
        variant="top"
        src={props.about.img}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{props.about.name}</Card.Title>
        <Card.Subtitle className="text-muted">{props.about.desc}</Card.Subtitle>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        {props.about.profiles.map(profile => (
          <a
            href={profile.link}
            target="_blank"
            rel="noopener noreferrer"
            key={profile.link}
          >
            <profile.icon
              style={{
                color: profile.color,
                fontSize: '1.25em',
                margin: '8px'
              }}
            />
          </a>
        ))}
      </Card.Footer>
    </Card>
  );

  render() {
    return (
      <div className="d-flex flex-column">
        <h2 className="my-4 mx-auto">About us!</h2>
        <CardDeck className="justify-content-center">
          {this.about.map(about => (
            <this.AboutCard about={about} key={about.profiles[0].link} />
          ))}
        </CardDeck>
      </div>
    );
  }
}

export default About;
