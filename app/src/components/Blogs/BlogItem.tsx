import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineTags } from "react-icons/ai";
import { BsCalendar3 } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";

import IconWrapper from "@/components/IconWrapper";
import Meta from "@/components/Meta";
import moment from "@/utils/moment";
import styles from "./BlogItem.module.scss";

interface BlogItemProps extends React.ComponentProps<"div"> {
  blog: Blog;
}

class BlogItem extends React.Component<BlogItemProps> {
  render() {
    const {
      blog: { title, text, url, category, tags, createdAt },
      className,
    } = this.props;
    const classes = `${styles.blogItem} ${className}`;
    return (
      <article className={classes}>
        <section className={styles.blogCover}>{/* TODO: 封面图片 */}</section>
        <section className={styles.blogContent}>
          <Link to={url}>
            <h1 className={styles.blogTitle}>{title}</h1>
            <p className={styles.blogText}>{text}</p>
          </Link>
          <div className={styles.blogMeta}>
            <span>
              <IconWrapper style={{ marginTop: "-3px" }}>
                <BsCalendar3 />
              </IconWrapper>
              <span style={{ padding: "5px" }}>
                {moment(createdAt).calendar()}
              </span>
            </span>
            <span>
              <IconWrapper style={{ marginTop: "-3px", fontSize: "20px" }}>
                <BiCategory />
              </IconWrapper>
              <Meta>{category}</Meta>
            </span>
            <span>
              <IconWrapper>
                <AiOutlineTags />
              </IconWrapper>
              {tags.map((el) => (
                <Meta key={el}>{el}</Meta>
              ))}
            </span>
          </div>
        </section>
      </article>
    );
  }
}

export default BlogItem;
