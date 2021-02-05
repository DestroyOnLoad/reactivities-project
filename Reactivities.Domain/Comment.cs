﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Reactivities.Domain
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public AppUser Author { get; set; }
        public Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
