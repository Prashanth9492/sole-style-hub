import 'dotenv/config';
import { getDatabase } from './db';

async function testReviews() {
  try {
    const db = await getDatabase();
    const reviews = await db.collection('reviews').find({}).toArray();
    
    console.log('\n===== ALL REVIEWS IN DATABASE =====');
    console.log(`Total reviews: ${reviews.length}\n`);
    
    reviews.forEach((review, idx) => {
      console.log(`Review ${idx + 1}:`);
      console.log(`  ID: ${review._id}`);
      console.log(`  User: ${review.userName}`);
      console.log(`  Rating: ${review.rating}⭐`);
      console.log(`  Comment: ${review.comment?.substring(0, 50)}...`);
      console.log(`  Images field exists: ${review.hasOwnProperty('images')}`);
      console.log(`  Images: ${JSON.stringify(review.images)}`);
      console.log(`  Image count: ${review.images?.length || 0}`);
      console.log(`  Videos field exists: ${review.hasOwnProperty('videos')}`);
      console.log(`  Videos: ${JSON.stringify(review.videos)}`);
      console.log(`  Video count: ${review.videos?.length || 0}`);
      console.log(`  Created: ${review.createdAt}`);
      console.log('---');
    });
    
    console.log('===================================\n');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testReviews();
